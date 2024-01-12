const express= require('express');
const mysql= require('mysql');
const cors= require('cors');

const port=8080

const app=express()

app.use(cors());
app.use(express.json())

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'tadi',
    database:'smart_attendance_system'

})


app.post('/Login',(req,res)=>{
    const sql="SELECT * FROM users WHERE USERNAME=? AND PASSWORD=?";
    const values=[
        req.body.username,
        req.body.password
    ];
    db.query(sql,values,(err,data)=>{
        if(err) return res.json(err);
        if(data.length>0){
            return res.json("Login Successful")
            
        }
        else{
            return res.json("Invalid Username or Password")
        }
    });
})

app.listen(port,(err)=>{
    if(err) console.log(err);
    console.log('Listening on port : ',port);
})