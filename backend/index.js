import dotenv from "dotenv";
dotenv.config();

import express from "express"

import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";
const app=express();
const server=http.createServer(app);


const io=new Server(server,{
    cors:{
    origin:"http://localhost:5173",
    credentials:true,//allow cookies to be sent from frontend to backend
    methods:["GET","POST"]
}
});//bidirectional communication between client and server
app.set("io",io)

const port=process.env.PORT || 5000; 
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true//allow cookies to be sent from frontend to backend
}));//middleware to enable CORS
app.use(express.json());//middleware to parse json data
app.use(cookieParser());//middleware to parse cookies
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/shop",shopRouter)
app.use("/api/item",itemRouter)
app.use("/api/order",orderRouter)
socketHandler(io)
server.listen(port,()=>{
connectDB();
console.log(`Server is running on port ${port}`)
})
