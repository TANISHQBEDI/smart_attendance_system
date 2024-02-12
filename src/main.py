import pymongo
from gridfs import GridFSBucket
import numpy as np
import cv2  # Assuming you're using OpenCV

# Load credentials from .env if applicable
import os
from dotenv import load_dotenv
load_dotenv()  # Optional; load environment variables from .env if used

# Replace placeholders with your actual values
MONGO_URI = os.getenv("MONGO_CONNECTION_STRING")  # Or your connection string directly
DATABASE_NAME = "student_attendance_system"
BUCKET_NAME = "studentimages"

# Connect to MongoDB
client = pymongo.MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
bucket = GridFSBucket(db, BUCKET_NAME)

# Retrieve all image files
images = []
labels=[]
for grid_out in bucket.find():
    try:
        image_data = grid_out.read()
        

        # Decode and preprocess image as needed
        image = np.frombuffer(image_data, dtype=np.uint8)
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        image = cv2.resize(image, (224, 224))
        image = image / 255.0
        label=grid_out.filename
        
        if label is not None:
            print(label)
            images.append(image)
            labels.append(label)

    except Exception as e:
        print(f"Error processing image: {e}")


label_dict = {label: idx for idx, label in enumerate(set(labels))}
print(label_dict)
labels_array = np.array([label_dict[label] for label in labels])

recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.train(images, labels_array)

recognizer.save("trained_model.yml")

# print(images)
# Use the retrieved images for your ML model
# ...

# Close the MongoDB connection
client.close()



