const mongoose = require("mongoose")
const express = require('express')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const { User } = require("./model/userSchema")
const session = require("express-session")

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static("public"))
app.use(session(
    {   
        name:"sessionId",
        secret:"1234",
        resave:false,
        saveUninitialized:false,
        cookie:{
            httpOnly:true,
            maxAge:1000*60*5,
            secure:false
        }
    }
))

mongoose.connect("mongodb://localhost/authentication")
.then(()=>console.log("DB connected"))
.catch(console.log)

//register happens in client(postman,thunder...)
app.post("/register",async (req,res)=>{
    const {username,password}=req.body
    const hashed = await bcrypt.hash(password,10)
    await User.create({username,password:hashed})
    res.json(req.body)
})

app.post("/login",async (req,res)=>{
    const {username,password} = req.body
    const user = await User.findOne({username})
    console.log(user)
    if(!user) return res.status(404).send({message:"invalid username"})
    const ok = await bcrypt.compare(password,user.password)
    if(!ok) return res.status(401).send({message:"incorrect password"})
    req.session.userId = user._id
    req.session.username = user.username
    res.redirect("/dashboard.html")
})

function isAuthenticated(req,res,next){
    if(req.session.userId)
        return next()
    res.status(401).json({message:"unAuthorized"})
}
app.get("/dashboard-data",isAuthenticated,(req,res)=>{
    res.json({message:`Hello  ${req.session.username}`})
})
app.get("/logout",(req,res)=>{
    req.session.destroy(
        err =>{if(err) return res.status(500).json({message:"logout failed"})}
    )
    res.clearCookie('sessionId')
    res.redirect("/login.html")
})

app.listen(3000,()=>console.log("server is connected at port 3000"))