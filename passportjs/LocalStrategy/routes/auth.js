const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User.js')
const path = require('path')
router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/login.html'))
})
router.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/register.html'))
})

router.post('/register',async (req,res)=>{
    try{
        const {username,password}=req.body;
        let user = await User.findOne({username})
        if(user) return res.status(400).send('User already exists');
        user = new User({username,password})
        await user.save()
        res.redirect('/login')
    }
    catch(err){
        res.status(500).send('Server Error during registration')
    }
})
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',
        {
            successRedirect:'/dashboard',
            failureRedirect: "/login"
        }
    )(req,res,next);//function call
})
router.get('/logout',(req,res,next)=>{
    req.logout((err)=>{
        if(err) return next(err);
        res.redirect('/login');
    })
})
router.get('/allusers',async (req,res)=>{
    const allusers = await User.find({})
    res.json(allusers)
})
module.exports = router