from flask import Flask, request, jsonify, send_from_directory
import pymongo
from gridfs import GridFSBucket
import numpy as np
import cv2  # Assuming you're using OpenCV
from dotenv import load_dotenv
import os
from flask_cors import CORS
from tensorflow.keras.models import load_model
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
import pickle
import datetime
import base64
import pytz
import os

# Load environment variables from .env if applicable
load_dotenv()

# Replace placeholders with your actual values
MONGO_URI = os.getenv("MONGO_CONNECTION_STRING")
print(MONGO_URI)
DATABASE_NAME = "student_attendance_system"
BUCKET_NAME = "studentimages"

app = Flask(__name__)
CORS(app, origins=['https://smart-attendance-system-six.vercel.app', '*'])

# Connect to MongoDB
client = pymongo.MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

from keras_facenet import FaceNet


# current_file_directory = os.path.dirname(os.path.abspath(__file__))
# model_path = os.path.join(current_file_directory, 'face-rec_Google.h5')
# print(current_file_directory)
# Load FaceNet model
# try:
#     facenet_model = load_model(model_path)
#     print("Facenet Model loaded")
# except Exception as e:
#     print(f"Error loading model: {e}")

embedder = FaceNet()

def preprocess_image(image):
    # Convert image to RGB
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    # Resize to 160x160 for FaceNet
    resized_image = cv2.resize(rgb_image, (160, 160))
    # Standardize pixel values
    standardized_image = (resized_image - 127.5) / 127.5
    return standardized_image

def get_face_embeddings(image):
    # preprocessed_image = preprocess_image(image)
    # print(image.dtype)
    # detections=embedder.extract(image)
    # embeddings = embedder.embeddings(detections)
    # return embeddings[0]
    detections = embedder.extract(image)
    if len(detections) > 0:
        return detections[0]['embedding']
    else:
        return None

def train_model():
    images = []
    labels = []
    bucket = GridFSBucket(db, BUCKET_NAME)

    for grid_out in bucket.find():
        try:
            image_data = grid_out.read()
            image = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)

            if image is None:
                print("Image is None")
                continue
            
            print("Image shape:", image.shape)
            
            # Get face embeddings
            embeddings = get_face_embeddings(image)

            if embeddings is None:
                print("No valid face found in image")
                continue

            label = grid_out.filename
            images.append(embeddings)
            labels.append(label)
        except Exception as e:
            print(f"Error processing image: {e}")

    if len(images) == 0:
        return "No valid faces found in database for training.", 400

    print(labels)

    # Encode labels
    label_encoder = LabelEncoder()
    labels_encoded = label_encoder.fit_transform(labels)

    # Check if there's only one unique label (one user)
    if len(set(labels_encoded)) == 1:
        print("Only one unique label found, duplicating data for training stability.")
        images = images * 2
        labels_encoded = np.concatenate([labels_encoded, labels_encoded])

    # Train SVM classifier on face embeddings
    classifier = SVC(kernel='linear', probability=True)
    classifier.fit(images, labels_encoded)

    # Save the label encoder and classifier
    with open('label_encoder.pkl', 'wb') as f:
        pickle.dump(label_encoder, f)

    with open('classifier.pkl', 'wb') as f:
        pickle.dump(classifier, f)

    return "Model trained successfully!", 200


@app.route('/api/train-model', methods=['POST'])
def train_model_endpoint():
    response, status_code = train_model()
    return jsonify({'message': response}), status_code

def recognize_face(image):
    try:
        with open('classifier.pkl', 'rb') as f:
            classifier = pickle.load(f)
        
        with open('label_encoder.pkl', 'rb') as f:
            label_encoder = pickle.load(f)
        
        embeddings_list = []
        
        for _ in range(5):  # Repeat recognition process 5 times for the same image
            embeddings = get_face_embeddings(image)
            if embeddings is not None:
                embeddings_list.append(embeddings)
        
        if not embeddings_list:
            print("No valid embeddings found.")
            return None
        
        # Average the embeddings from multiple attempts for better recognition
        embeddings_average = np.mean(embeddings_list, axis=0)
        
        predictions = classifier.predict_proba([embeddings_average])
        best_class_indices = np.argmax(predictions, axis=1)
        best_class_probabilities = predictions[0, best_class_indices]

        # Get the predicted class label using label encoder
        predicted_class_label = label_encoder.inverse_transform(best_class_indices)[0]

        # Print the predicted class label and confidence level
        print("Predicted class:", predicted_class_label)
        print("Confidence level:", best_class_probabilities)

        if best_class_probabilities > 0.75:  # Confidence threshold
            student_name = label_encoder.inverse_transform(best_class_indices)[0]
            return student_name
        else:
            print("Confidence below threshold.")
            return None
    except Exception as e:
        print(f"Error in recognition: {e}")
        return None


@app.route('/attendance/<subject>', methods=['POST'])
def take_attendance(subject):
    try:
        if request.is_json:
            image_data_base64 = request.json.get('imageData')
            if not image_data_base64:
                return jsonify({'message': 'Missing image data in request'}), 400

            image_data_base64 = image_data_base64.split(",")[1]
            image_data_bytes = base64.b64decode(image_data_base64)
            image_array = np.frombuffer(image_data_bytes, dtype=np.uint8)
            image = cv2.imdecode(image_array, flags=cv2.IMREAD_COLOR)

            if image is None:
                return jsonify({'message': 'Invalid image data'}), 400

            label = recognize_face(image)
            if label:
                student_name = label
                timezone = pytz.timezone('Asia/Kolkata')
                current_datetime = datetime.datetime.now(timezone)
                date_str = current_datetime.strftime("%d-%m-%Y")
                day = current_datetime.strftime("%A")
                time_str = current_datetime.strftime("%I:%M:%S %p")
                attendance = db['studentattendance']
                existing_attendance_query = {
                    "student_name": student_name,
                    "subject": subject,
                    "date": date_str
                }

                existing_attendance = attendance.find_one(existing_attendance_query)

                if existing_attendance is None:
                    attendance_data = {
                        "student_name": student_name,
                        "subject": subject,
                        "date": date_str,
                        "day": day,
                        "time": time_str
                    }

                    attendance.insert_one(attendance_data)
                    return jsonify({'message': f'Attendance recorded for {student_name} in {subject}'})
                else:
                    return jsonify({'message': f'Attendance for {student_name} already recorded for {subject}'})
            else:
                return jsonify({'message': 'No face detected or recognized'}), 401
        else:
            return jsonify({'message': 'Invalid request format'}), 400
    except Exception as e:
        print(f"Error recording attendance: {e}")
        return jsonify({'message': 'Error recording attendance'}), 500

# Close the MongoDB connection
def close_connection():
    client.close()

if __name__ == '__main__':
    app.run(debug=True)
