import cv2
import numpy as np
import os
import pymongo
from dotenv import load_dotenv
load_dotenv()  # Optional; load environment variables from .env if used

# Replace placeholders with your actual values
MONGO_URI = os.getenv("MONGO_CONNECTION_STRING")  # Or your connection string directly
DATABASE_NAME = "student_attendance_system"
BUCKET_NAME = "studentimages"

# Connect to MongoDB
client = pymongo.MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

# Get the directory of the current file
current_file_directory = os.path.dirname(os.path.abspath(__file__))

# Construct paths relative to the current file's directory
model_path = os.path.join(current_file_directory, 'model', 'trained_model.yml')

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read(model_path)


import main

label_dict=main.label_dict
stname=''
def recognize_face(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
    for (x, y, w, h) in faces:
        roi_gray = gray[y:y+h, x:x+w]
        label, confidence = recognizer.predict(roi_gray)
        if confidence < 100:
            for key, value in label_dict.items():
                if label == value:
                    stname= key
            label_text = f"{stname}"
            # record_attendance(stname)
            
        else:
            label_text = "Unknown"
        cv2.putText(frame, label_text, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,0), 2)
        cv2.rectangle(frame, (x,y), (x+w, y+h), (0, 255, 0), 2)
    return frame

import datetime

def record_attendance(stname):
    client = pymongo.MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    collection = db['studentdata']
    attendance=db['studentattendance']
    student_doc = collection.find_one({"studentname": stname})
    if student_doc:
        student_id=student_doc['_id']
        # Record attendance using student_id and student_name
        now = datetime.datetime.now()
        date_str = now.strftime("%Y-%m-%d")
        time_str = now.strftime("%H:%M:%S")
        query = {"student_id": student_id, "date": date_str, "time": {"$gte": time_str - timedelta(minutes=5), "$lte": time_str + timedelta(minutes=5)}}
        existing_record = attendance.find_one(query)
        if existing_record is None:
            # Insert new attendance record
            data = {
                "student_id": student_id,
                "date": date_str,
                "time": time_str,
                
            }
            attendance.insert_one(data)


    else:
        print("Student not found in database.")
        # Check for existing attendance
    

    

    client.close()

def main():
    cap = cv2.VideoCapture(0)  # Open default camera

    while True:
        ret, frame = cap.read()  # Capture frame-by-frame

        if not ret:
            print("Can't receive frame (stream end?). Exiting...")
            break

        frame = recognize_face(frame)  # Perform face recognition

        cv2.imshow('Video', frame)  # Display the resulting frame

        if cv2.waitKey(1) == ord('q'):  # Exit on 'q' key press
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    main()
