import cv2
import numpy as np
import os

# Get the directory of the current file
current_file_directory = os.path.dirname(os.path.abspath(__file__))

# Construct paths relative to the current file's directory
model_path = os.path.join(current_file_directory, 'model', 'trained_model.yml')

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read(model_path)

def recognize_face(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
    for (x, y, w, h) in faces:
        roi_gray = gray[y:y+h, x:x+w]
        label, confidence = recognizer.predict(roi_gray)
        if confidence < 100:
            label_text = f"Person {label}"
        else:
            label_text = "Unknown"
        cv2.putText(frame, label_text, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,0), 2)
        cv2.rectangle(frame, (x,y), (x+w, y+h), (0, 255, 0), 2)
    return frame

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
