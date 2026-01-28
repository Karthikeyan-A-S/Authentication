const mongoose= require("mongoose")
const userSchema = mongoose.Schema(
    {
        username:String,
        password:String
    }
);
exports.User = mongoose.model("User",userSchema)
