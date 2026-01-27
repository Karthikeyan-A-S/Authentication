const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jwt-simple")
const cookieParser = require("cookie-parser")
const { User } = require("./model/User")

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static("public"))

const SECRET = "12345";

mongoose.connect("mongodb://localhost/jwtSimpleDB").then(()=>console.log("DB connected"))
.catch(console.log)
app.post("/register",async (req,res)=>{
    const hashed = await bcrypt.hash(req.body.password,10)
    await User.create({username:req.body.username,password:hashed})
    res.json(req.body)
})
app.post("/login",
    async (req,res)=>{
        const {username,password} = req.body
        const user = await User.findOne({username})
        
        if(!user) return res.status(404).send("User not found")
        
        const ok = await bcrypt.compare(password,user.password)
        if(!ok) return res.status(401).send("wrong password")
        
        const token = jwt.encode({id:user._id,username:user.username},SECRET);
        res.cookie("token",token,
            {
                httpOnly:true,
                sameSite:true,
                maxAge:1000*60
            }
        )
        res.redirect("/dashboard.html")
    }
)
app.get("/dashboard-data",(req,res)=>{
    const token = req.cookies.token;
    if(!token) return res.status(401).send("No token")
    try{
        const decoded = jwt.decode(token,SECRET);
        res.json({message:`Welcome ${decoded.username}`})
    }
    catch{
        res.status(401).send("Invalid token");
    }
})
app.get("/logout",(req,res)=>{
    res.clearCookie("token");
    res.redirect("/login.html")
})
app.listen(3000,()=>{
    console.log("server running at port 3000")
})