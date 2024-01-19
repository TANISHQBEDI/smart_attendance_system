const express= require('express');
const cors= require('cors');

const port=8080

const app=express()

app.use(cors());
app.use(express.json())


const path=require('path')
require('dotenv').config({ path: path.join(__dirname,'../.env')});

const { MongoClient, ServerApiVersion,GridFSBucket } = require('mongodb');


const uri = process.env.MONGO_CONNECTION_STRING;

const client = new MongoClient(uri);

const dbName='student_attendance_system';

// MONGO CONNECTIONS
app.post('/api/login', async (req, res) => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const adminCollection = db.collection('admindata');

        const { username, password } = req.body;
        // console.log(adminCollection)
        const admin = await adminCollection.findOne({name:'HOD'});
        console.log('Received credentials:', username, password);
        console.log('db res : ',admin)

        if (admin && admin.password === password) {
            res.json({ status: 'success', message: 'Login Successful' });
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid Username or Password' });
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
        console.log('MongoDB connection closed');
    }
});


const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

const { Readable } = require('stream');

app.post('/api/newstudentenroll',upload.array('selectedFiles', 5),async (req,res)=>{
    try {
        
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const studentCollection = db.collection('studentdata');
        const bucket = new GridFSBucket(db,{bucketName:'studentimages'});

        // Extract data from the request
        const { sName, sEmail, sPassword, sBranch, sYear } = req.body;

        console.log('req : ',req.files)

        const existingStudent = await studentCollection.findOne({
            studentemail: sEmail,
            // Add other relevant fields for comparison
        });

        if(existingStudent){
            return res.status(400).json({ error: 'Student already enrolled' });
        }
        else{
            const studentDataResult = await studentCollection.insertOne({
                studentname: sName,
                studentemail: sEmail,
                studentpassword: sPassword,
                studentbranch: sBranch,
                studentyear: sYear,
            });
            
    
            const studentId = studentDataResult.insertedId;
    
            // Store student images in GridFS
            
            const files = req.files;
            for (const file of files) {
    
    
                const readableStream = new Readable();
                readableStream.push(file.buffer);
                readableStream.push(null);
    
                const uploadStream = bucket.openUploadStream(file.originalname);
                const uploadResult = await new Promise((resolve, reject) => {
                    readableStream.pipe(uploadStream);
                    uploadStream.on('error', reject);
                    uploadStream.on('finish', () => {
                        resolve(uploadStream.id);
                    });
                });
    
                // Associate uploaded image file IDs with student ID in your 'studentdata' collection
                await studentCollection.updateOne(
                    { _id: studentId },
                    { $push: { imageIds: uploadResult } }
                );
            }
    
            res.status(201).json({ message: 'Student enrolled successfully' });
        }

        // Insert student data into 'studentdata' collection
        


    } catch (error) {
        console.error('Error enrolling student:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally{
        await client.close();
        console.log('MongoDB connection closed');
    }
    
})


app.listen(port,(err)=>{
    if(err) console.log(err);
    console.log('Listening on port : ',port);
})