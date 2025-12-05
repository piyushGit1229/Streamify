import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true
    },
    avatar : {
        type : String,
        default: ""
    },

    channelDescription:{type : String , defualt : ""},
    channelBanner : {type:String,default:""},
    subscribersCount : {type: Number , defualt:0},
    subscrptionsCount : {type:Number,default:0},
    

    refreshTokens : [
        {
            token : {type : String},
            createdAt : {type : Date, default : Date.now}
        }
    ]
},{timestamps : true});

const User = mongoose.model("User", userSchema);
export default User;