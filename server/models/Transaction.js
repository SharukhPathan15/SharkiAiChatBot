import mongoose from "mongoose";

const transactionSchema=new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',requred:true},
  planId:{type:String,requred:true},
  amount:{type:Number,requred:true},
  credits:{type:Number,requred:true},
  isPaid:{type:Boolean,default:false},
},{timestamps:true})

const Transaction=mongoose.model('Transaction',transactionSchema);


export default Transaction;