from flask import Flask, request, jsonify,send_from_directory
import pymongo
from gridfs import GridFSBucket
import numpy as np
import cv2  # Assuming you're using OpenCV
from dotenv import load_dotenv
import os
from flask_cors import CORS

# Load environment variables from .env if applicable
load_dotenv()

# Replace placeholders with your actual values
MONGO_URI = os.getenv("MONGO_CONNECTION_STRING")
MONGO_URI=MONGO_URI+'=true&w=majority'
print(MONGO_URI)
DATABASE_NAME = "student_attendance_system"
BUCKET_NAME = "studentimages"

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

# Connect to MongoDB (same as your existing code)
client = pymongo.MongoClient(MONGO_URI)

db = client[DATABASE_NAME]


label_dict_global=dict()

# Function to train the model and save it
# (adapted from your existing code)

def train_model():
    images = []
    labels = []
    bucket = GridFSBucket(db, BUCKET_NAME)
    for grid_out in bucket.find():
        try:
            image_data = grid_out.read()
            image = np.frombuffer(image_data, dtype=np.uint8)
            image = cv2.imdecode(image, cv2.IMREAD_COLOR)
            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            image = cv2.resize(image, (224, 224))
            image = image / 255.0
            label = grid_out.filename

            if label is not None:
                images.append(image)
                labels.append(label)
        except Exception as e:
            print(f"Error processing image: {e}")

    if len(images) == 0:
        return "No images found in database for training.", 400

    label_dict = {label: idx for idx, label in enumerate(set(labels))}
    label_dict_global=label_dict
    labels_array = np.array([label_dict[label] for label in labels])

    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.train(images, labels_array)

    current_file_directory = os.path.dirname(os.path.abspath(__file__))
    file_save = os.path.join(current_file_directory, 'model', 'trained_model.yml')

    recognizer.save(file_save)

    return "Model trained successfully!", 200


@app.route('/api/train-model', methods=['POST'])
def train_model_endpoint():
    # Call the train_model function and return the response
    
    response, status_code = train_model()
    return jsonify({'message': response}), status_code



import datetime
import base64


@app.route('/attendance/<subject>',methods=['POST'])
def take_attendance(subject):
    try:
        def recognize_face(image):
            # Load the trained LBPH model from a file
            
            recognizer = cv2.face.LBPHFaceRecognizer_create()
            model_path = os.path.join(os.path.dirname(__file__), 'model', 'trained_model.yml')
            # print(model_path)
            recognizer.read(model_path)
            model_loaded = recognizer.read(model_path)
            print("Model loaded successfully:", model_loaded)
            print(recognizer.getThreshold())

            # Try to detect and recognize faces in the image
            faces, confidences = recognizer.predict(image)

            # Identify the first recognized face with sufficient confidence
            if isinstance(faces, int):
                # Only one face detected
                confidence = confidences
                if confidence < 100:
                    # Convert label index to student name using label_dict (if applicable)
                    student_name = label_dict_global.get(faces, None)
                    return student_name
                else:
                    return None
            else:
                # Multiple faces detected
                for face, confidence in zip(faces, confidences):
                    if confidence < 100:
                        # Convert label index to student name using label_dict (if applicable)
                        student_name = label_dict_global.get(face, None)
                        return student_name
                return None
        # 1. Validate request data (if applicable)
        # (e.g., check for required fields, data types)

        # 2. Securely extract image data from the request
        # (replace with your implementation based on frontend request format)
        # This example assumes the image data is sent as base64 encoded string
        if request.is_json:
            image_data_base64 = request.json.get('imageData')
            # print(image_data_base64)
            if not image_data_base64:
                return jsonify({'message': 'Missing image data in request'}), 400

            # Decode base64 string and convert to a NumPy array
            image_data_base64 = image_data_base64.split(",")[1]
            image_data_bytes = base64.b64decode(image_data_base64)
            # print(image_data_bytes)
            image_array = np.frombuffer(image_data_bytes, dtype=np.uint8)
            # print(image_array.shape)
            image = cv2.imdecode(image_array, flags=cv2.IMREAD_COLOR)
            # print(image)
            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            image = cv2.resize(image, (224, 224))
            image = image / 255.0
            label = recognize_face(image)
            if label:
                # Identify the student based on the label or label_dict
                student_name = label

                attendance_data = {
                    "student_name": student_name,
                    "subject": subject,
                    "timestamp": datetime.datetime.utcnow()  # Use appropriate timestamp format
                }
                attendance = db['studentattendance']
                attendance.insert_one(attendance_data)

                return jsonify({'message': f'Attendance recorded for {student_name} in {subject}'})
            else:
                return jsonify({'message': 'No face detected or recognized'}), 401
        else:
            return jsonify({'message': 'Invalid request format'}), 400
        

    except Exception as e:
        print(f"Error recording attendance: {e}")
        return jsonify({'message': 'Error recording attendance'}), 500




# Close the MongoDB connection (moved to a separate function for clarity)
def close_connection():
    client.close()

@app.teardown_appcontext
def teardown_db(exception):
    close_connection()  # Call the close_connection function

if __name__ == '__main__':
    app.run(debug=True)  # Set debug=False for production
