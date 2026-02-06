const express = require('express')
const session = require('express-session')
const passport = require('passport')
const path = require('path')
const authRoutes = require('./routes/auth.js')
const mongoose = require('mongoose')
require('dotenv').config();
const app =express()
require('./config/passport.js')(passport)
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("mongodb connected"))
.catch(console.log)

app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/',authRoutes)
app.get('/',(req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect('/dashboard')
    }
    res.redirect('/login')
})
app.get('/dashboard',(req,res)=>{
    if(req.isAuthenticated()){
        res.sendFile(path.join(__dirname,'./public/dashboard.html'))
    }
    else{
        res.redirect('/login')
    }
})

app.listen(process.env.PORT,()=>{
    console.log("server listen at port ",process.env.PORT)
})
