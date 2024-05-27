import cv2
# print(cv2.__version__)
from dotenv import load_dotenv
import pymongo
from gridfs import GridFSBucket
import numpy as np
import json
import os
load_dotenv()

# Replace placeholders with your actual values
MONGO_URI = os.getenv("MONGO_CONNECTION_STRING")
# MONGO_URI=MONGO_URI+'=true&w=majority'
print(MONGO_URI)
DATABASE_NAME = "student_attendance_system"
BUCKET_NAME = "studentimages"

client = pymongo.MongoClient(MONGO_URI)

db = client[DATABASE_NAME]


# # def train_model():
# #     images = []
# #     labels = []
# #     bucket = GridFSBucket(db, BUCKET_NAME)
# #     for grid_out in bucket.find():
# #         try:
# #             image_data = grid_out.read()
# #             image = np.frombuffer(image_data, dtype=np.uint8)
# #             image = cv2.imdecode(image, cv2.IMREAD_COLOR)
# #             image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
# #             image = cv2.resize(image, (224, 224))
# #             image = image / 255.0
# #             label = grid_out.filename
# #             print(label)

# #             if label is not None:
# #                 images.append(image)
# #                 labels.append(label)
# #         except Exception as e:
# #             print(f"Error processing image: {e}")

# #     if len(images) == 0:
# #         return "No images found in database for training.", 400

# #     label_dict = {}
# #     if os.path.exists('label_dict.json'):
# #         with open('label_dict.json', 'r') as json_file:
# #             label_dict = json.load(json_file)

# #     # Update label dictionary with new labels
# #     new_labels = set(labels) - set(label_dict.keys())
# #     label_indices = {label: idx + len(label_dict) for idx, label in enumerate(new_labels)}
# #     label_dict.update(label_indices)
# #     print(label_dict)

# #     # Save the updated label dictionary to the JSON file
# #     with open('label_dict.json', 'w') as json_file:
# #         json.dump(label_dict, json_file)

# #     labels_array = np.array([label_dict[label] for label in labels])
# #     # labels_array=np.unique(labels_array)
# #     # np.append(labels_array,1)
# #     print(labels_array)

# #     recognizer = cv2.face.LBPHFaceRecognizer_create()
# #     # recognizer.setThreshold(80)
# #     recognizer.setRadius(2)
# #     recognizer.setNeighbors(12)
# #     recognizer.train(images, labels_array)

# #     current_file_directory = os.path.dirname(os.path.abspath(__file__))
# #     file_save = os.path.join(current_file_directory, 'model', 'trained_model.yml')

# #     recognizer.save(file_save)

# #     return "Model trained successfully!", 200

# current_file_directory = os.path.dirname(os.path.abspath(__file__))
# cascade = os.path.join(current_file_directory, 'haarcascade_frontalface_default.xml')
# face_cascade = cv2.CascadeClassifier(cascade)
# print(face_cascade)

# def detect_faces(image):
#     # Convert image to grayscale
#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
#     # Detect faces in the image
#     faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    
#     # Extract and return the first detected face (assuming only one face is present)
#     if len(faces) > 0:
#         x, y, w, h = faces[0]
#         face_roi = gray[y:y+h, x:x+w]
#         print(face_roi.shape)
#         return face_roi
#     else:
#         return None


# import json

# def train_model():
#     images = []
#     labels = []
#     bucket = GridFSBucket(db, BUCKET_NAME)
    
#     for grid_out in bucket.find():
#         try:
#             image_data = grid_out.read()
#             image = np.frombuffer(image_data, dtype=np.uint8)
#             image = cv2.imdecode(image, cv2.IMREAD_COLOR)
            
#             # Detect faces in the image
#             face_roi = detect_faces(image)
            
#             if face_roi is not None:
#                 # Resize and preprocess face region of interest
#                 face_roi = cv2.resize(face_roi, (224, 224))
#                 face_roi = face_roi / 255.0
                
#                 label = grid_out.filename

#                 images.append(face_roi)
#                 labels.append(label)
#         except Exception as e:
#             print(f"Error processing image: {e}")

#     if len(images) == 0:
#         return "No valid faces found in database for training.", 400
#     label_dict = {}
#     if os.path.exists('label_dict.json'):
#         with open('label_dict.json', 'r') as json_file:
#             label_dict = json.load(json_file)

#     # Update label dictionary with new labels
#     new_labels = set(labels) - set(label_dict.keys())
#     label_indices = {label: idx + len(label_dict) for idx, label in enumerate(new_labels)}
#     label_dict.update(label_indices)
#     print(label_dict)

#     # Save the updated label dictionary to the JSON file
#     with open('label_dict.json', 'w') as json_file:
#         json.dump(label_dict, json_file)

#     labels_array = np.array([label_dict[label] for label in labels])
#     # Train the LBPH recognizer with detected faces
#     # recognizer = cv2.face.LBPHFaceRecognizer_create()
#     # recognizer.setRadius(2)
#     # recognizer.setNeighbors(8)
#     recognizer = cv2.face.LBPHFaceRecognizer_create(radius=1, neighbors=8, grid_x=8, grid_y=8, threshold=100)

#     recognizer.train(images, labels_array)

#     print(recognizer.getThreshold())

#     current_file_directory = os.path.dirname(os.path.abspath(__file__))
#     file_save = os.path.join(current_file_directory, 'model', 'trained_model.yml')

#     recognizer.save(file_save)

#     return "Model trained successfully!", 200
# train_model()


import cv2
from dotenv import load_dotenv
import pymongo
from gridfs import GridFSBucket
import numpy as np
import json
import os
import pickle
from flask_cors import CORS
from tensorflow.keras.models import load_model
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from keras_facenet import FaceNet

# Load environment variables from .env if applicable
load_dotenv()

# Replace placeholders with your actual values
MONGO_URI = os.getenv("MONGO_CONNECTION_STRING")
print(MONGO_URI)
DATABASE_NAME = "student_attendance_system"
BUCKET_NAME = "studentimages"

client = pymongo.MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

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

train_model()
