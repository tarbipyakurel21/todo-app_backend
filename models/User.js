const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({

    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,default:null},
    googleId:{type:String,default:null},


});

module.exports=mongoose.model("User",UserSchema);

