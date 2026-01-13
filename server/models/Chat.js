import mongoose from "mongoose";


const chatSchema=new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',requred:true},
  userName:{type:String,requred:true},
  name:{type:String,requred:true},
  messages:[
    {
      isImage:{type:Boolean,reqired:true},
      isPublished:{type:Boolean,default:false},
      role:{type:String,reqired:true},
      content:{type:String,reqired:true},
      timeStamp:{type:Number,reqired:true},
    }
  ],
},{timestamps:true});

const Chat=mongoose.model('Chat',chatSchema);


export default Chat;