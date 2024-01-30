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
for grid_out in bucket.find():
    try:
        image_data = grid_out.read()
        

        # Decode and preprocess image as needed
        image = np.frombuffer(image_data, dtype=np.uint8)
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
        # print(image)
        # Apply additional preprocessing steps as required
        # ...

        images.append(image)

    except Exception as e:
        print(f"Error processing image: {e}")

# print(images)
# Use the retrieved images for your ML model
# ...

# Close the MongoDB connection
client.close()

# for image in images:
#     cv2.imshow("Image", image)
#     cv2.waitKey(0)  
#     cv2.destroyAllWindows()


def preprocess_image(image):
    # Convert to grayscale (if RGB)
    if len(image.shape) == 3:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Resize to a consistent size (e.g., 224x224 for common CNNs)
    image = cv2.resize(image, (224, 224))
    # Normalize pixel values to the range [0, 1]
    image = image / 255.0



    return image

for image in images:
    cv2.imshow("Image", preprocess_image(image))
    cv2.waitKey(0)  
    cv2.destroyAllWindows()