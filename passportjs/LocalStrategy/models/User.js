const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true,
    trim:true
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Export the model so Passport and your Routes can use it
UserSchema.pre('save',async function () {
    const user = this;
    if(!user.isModified('password')) return;
    try{
        console.log(user.password)
        const hash = await bcrypt.hash(user.password,10);
        console.log(hash)
        user.password = hash;
    }   
    catch(err){
        console.log(err)
        throw err
    }
})
module.exports = mongoose.model("User", UserSchema);
