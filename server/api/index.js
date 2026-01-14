import express from 'express'
import cors from 'cors';
import 'dotenv/config'
import connectDB from '../config/db.js';
import userRouter from '../routes/userRoutes.js';
import chatRouter from '../routes/chatRoutes.js';
import messageRouter from '../routes/messageRoute.js';
import creditRouter from '../routes/creditRoutes.js';
import { stripeWebhooks } from '../controllers/webhooks.js';

const app=express();



//Stripe Webhooks
app.post('/api/stripe',express.raw({type:'application/json'}),stripeWebhooks);


//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.get('/',(req,res)=> res.send('Server is Live'));
app.use('/api/user',userRouter);
app.use('/api/chat',chatRouter);
app.use('/api/message',messageRouter);
app.use('/api/credit',creditRouter);



// const PORT=process.env.PORT || 3000;


// app.listen(PORT,()=>{
//   console.log(`Server is running on PORT ${PORT}`);
// })



export default async function handler(req, res) {
  // Make sure DB is connected
  if (!connectDB.isConnected) {
    await connectDB();
  }
  app(req, res);
}