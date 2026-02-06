const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const User = require('../models/User.js');


function ConfigPassport(passport){
    passport.use(
        new LocalStrategy({usernameField:'username',passwordField:'password'},async (username,pass,done)=>
    {
        try{
            const user = await User.findOne({username:username})
            if(!user){
                return done(null,false,{msg:"User is not defined"})
            }
            const isMatch = await bcrypt.compare(pass,user.password)
            if(isMatch) return done(null,user)
            return done(null,false,{msg:"invalid password"})
        }
        catch(err){
            return done(err)
        }
    }
    ));
    passport.serializeUser((user,done)=>{
        return done(null,user.id)
    });
    passport.deserializeUser(async (userId,done )=>{
        const user = User.findOne({id:userId})
        return done(null,user)
    })
}
module.exports = ConfigPassport