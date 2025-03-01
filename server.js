const express=require('express')
const mongooes=require('mongoose')
const cors=require("cors")
require('dotenv').config()
const User=require('./models/User')
const bcrypt=require('bcryptjs')
const { request } = require('http')

const app=express()
const PORT=3000
app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:5173", // Your frontend's URL
      credentials: true,
    })
  );

app.get('/',(req, res)=>{
    res.send("Welcome to the MERN stack ")
})

app.post('/register',async(req , res)=>{
    const {username,email,password}=req.body
    try{
        console.log(password,email,username)
         const hashedPassword= await bcrypt.hash(password,10)
         const user=new User({username,email,password:hashedPassword})
         await user.save()
         console.log("User Registration completed...")
         res.json({message: "User Registred.."})
    }
    catch(err)

    {
        console.log(err)
        res.json({error:"signUp error "})
    }
})

app.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
         const user = await User.findOne({ email });
         if (!user || !(await bcrypt.compare (password, user.password)))
         {
         return res.status(400).json ({message: "Invalid Credentials"});
         }
         res.json({message: "Login Successful", username: user.username});
    }

    catch(err)
    {
        console.log(err)
        res.json({error:"login error "})

    }
})



mongooes.connect(process.env.MONGO_URL).then(
()=>console.log("DB connected successfully..")
).catch(
    (err)=>console.log(err)
)

app.listen(PORT,(err)=>{
    if(err)
    {
        console.log(err)
    }
    console.log("server is running on port : "+PORT)
})