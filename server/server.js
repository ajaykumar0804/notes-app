import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/connectDB.js';
dotenv.config();

import path from 'path';

const app = express();
app.use(express.json());
const __dirname=path.resolve();

import authRoute from './routes/auth.route.js'
import notesRoute from './routes/user.route.js'

app.use(cors({
  origin : "http://localhost:3000",
  credentials:true
}));

app.use(express.urlencoded({
  extended:true
}))

// app.get("/", (req, res) => {
//   res.json({ data: "hello" })
// });

app.use(cookieParser());

app.use("/api/auth", authRoute);
// Example Route
app.use('/api/notes',notesRoute);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"/client/build")))
  app.use("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"client","build","index.html"))
  })
}


const PORT=process.env.PORT

app.listen(PORT,()=>{
  console.log("server is running at port 8000");
  connectDB();
});

