/* The code is a Node.js server using the Express framework. It sets up a server to handle HTTP
requests on port 8080. */
const express= require('express');


// using Cross-Origin Resource Sharing to enable request from other origins
const cors= require('cors');

const port=8080



const app=express()


// app.options('*',cors());
app.use(cors({
    origin: "https://smart-attendance-system-six.vercel.app"
}));
app.use(cors());
app.use(express.json())





const path=require('path')

app.use(express.static(path.join(__dirname, 'public')));
// It is always good to import relative path

// Importing environment variables from .env
require('dotenv').config({ path: path.join(__dirname,'../.env')});




const { MongoClient, ServerApiVersion,GridFSBucket } = require('mongodb');


const uri = process.env.MONGO_CONNECTION_STRING;
// const uri = process.env.MONGO_CONNECTION_STRING+"=true&w=majority";

// console.log(uri)

const client = new MongoClient(uri);

const dbName='student_attendance_system';

// Initialzing mongo connection


app.post('/api/login', async (req, res) => {
    try {
        await client.connect();
        console.log('Connected to MongoDB'); //Connect to mongo DB server


        const db = client.db(dbName);
        const adminCollection = db.collection('admindata');    //Fetch all records from the collection 

        const { username, password } = req.body;        //Get the  data sent by user through post request
        // console.log(adminCollection)
        const admin = await adminCollection.findOne({name:'HOD'});

        console.log('Received credentials:', username, password);
        console.log('db res : ',admin)

        if (admin && admin.password === password) {
            res.json({ status: 'success', message: 'Login Successful' });
            //Use this to send  response back to front end and then route accordingly
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid Username or Password' });
            //This error is given when the credentials are wrong
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        //This error is given when any problem occurs during connecting to mongo
    } finally {
        await client.close();
        console.log('MongoDB connection closed');
        //Close the database to save resources
    }
});


const multer = require('multer');
//We use multer to import large files


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//The above initializes a local temporary storage to store the files
// console.log(upload)

const { Readable } = require('stream');




app.post('/api/newstudentenroll',upload.array('images[]'),async (req,res)=>{
    try {
        // console.log(req.body)
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const studentCollection = db.collection('studentdata');
        const bucket = new GridFSBucket(db, { bucketName: 'studentimages' });
        bucket.on('error', (error) => {
            console.error('Error creating GridFS bucket:', error);
        });


        // Extract data from the request
        const { name, email, password, branch, year,images} = req.body;

        // console.log(images)
        const existingStudent = await studentCollection.findOne({
            studentemail: email,
            // Add other relevant fields for comparison
        });

        if(existingStudent){
            return res.status(400).json({ error: 'Student already enrolled' });
        }
        else{
            const studentDataResult = await studentCollection.insertOne({
                studentname: name,
                studentemail: email,
                studentpassword: password,
                studentbranch: branch,
                studentyear: year,
            });
            
    
            const studentId = studentDataResult.insertedId;
    
            // Store student images in GridFS
            // const files=images.map(file=>file.buffer.toString('base64'))
            // console.log(files)
            const files = images;
            // console.log(files)
            for (const file of files) {
    
                const base64Data = file.split(',')[1]; // Extract base64-encoded data
                const buffer = Buffer.from(base64Data, 'base64'); // Convert base64 to buffer
                const readableStream = new Readable();
                readableStream.push(buffer);
                readableStream.push(null);
                const imageName = name; // Assuming imageName is present in each file object


                const uploadStream = bucket.openUploadStream(imageName);    //Upload the images to the atlas bucket 
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

app.get('/api/viewattendance', async (req, res) => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const Attendance=db.collection('studentattendance')
        
        const subject = req.body.subject;
        let attendanceRecords;

        if (subject) {
            // console.log("Log result",await Attendance.find({ subject: subject }).toArray())
            attendanceRecords = await Attendance.find({ subject: subject }).toArray();
            
        } else {
            // console.log("Log result",Attendance.find().toArray())
            attendanceRecords = await Attendance.find({}).toArray();
            
        }
        
        console.log(attendanceRecords)
        res.json(attendanceRecords);
        
        

    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally{
        await client.close();
        console.log('MongoDB connection closed');
    }
});


app.listen(port,(err)=>{
    if(err) console.log(err);
    console.log('Listening on port : ',port);
})