const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
    {
        username:String,
        password:String
    }
);
exports.User = mongoose.model("User",UserSchema);
