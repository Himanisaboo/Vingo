import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import gentoken from "../utils/token.js";
import  {sendOtpMail} from "../utils/mail.js";
 export const signUp=async(req,res)=>{
    try{
         const {fullName,email,password,mobile,role}=req.body;//yani frontend se ye data aayega
         const existingUser=await User.findOne({email});//check karega ki kya user already exist karta hai
        if(existingUser){
          return res.status(400).json({message:"User already exists"});
}
if(password.length<6){
    return res.status(400).json({message:"Password must be at least 6 characters long"});
}
if(mobile.length!==10){
    return res.status(400).json({message:"Mobile number must be 10 digits long"});
}
const hashedPassword=await bcrypt.hash(password,10);//password ko hash karna
const user=await User.create({
    fullName,
    email,
    role,
    mobile,
    password:hashedPassword
})
const token=await gentoken(user._id);
res.cookie("token",token,{

secure:false,//production me true karna
sameSite:"strict",
maxAge:7*24*60*60*1000,//7 days
httpOnly:true

    })
    res.status(201).json(user);
}
   catch(error){
   console.log("ERROR:", error);
   res.status(500).json({
      success:false,
      message:error.message
   });
}
}
export const signIn=async(req,res)=>{
    try{
         const {email,password}=req.body;//yani frontend se ye data aayega
         const user=await User.findOne({email});//check karega ki kya user already exist karta hai
        if(!user){
          return res.status(400).json({message:"User does not exists"});
}

const isMatch=await bcrypt.compare(password,user.password);
if(!isMatch){
    return res.status(400).json({message:"Incorrect password"});
}
const token=await gentoken(user._id);
res.cookie("token",token,{

secure:false,//production me true karna
sameSite:"strict",
maxAge:7*24*60*60*1000,//7 days
httpOnly:true

    })
    res.status(201).json(user);
}
    catch(error){
        res.status(500).json('sign in error ${error.message}');
    }
}
export const signOut=async(req,res)=>{
    try{
        res.clearCookie("token");
        res.status(200).json({message:"Signout successful"});
    }
   catch(error){
    res.status(500).json('sign out error ${error.message}'); 
   }}
   
export const sendOtp=async(req,res)=>{
    try{
      const{email}=req.body
      const user=await User.findOne({email})
      if(!user){
        return res.status(400).json({message:"User does not exists."})
      }
      const otp=Math.floor(1000 +Math.random()*9000).toString()
       user.resetOtp=otp
       user.otpExpires=Date.now()+5*60*1000
       user.isOtpVerified=false
       await user.save()
       await sendOtpMail(email,otp)
       return res.status(200).json({message:"otp send successfully"})
    }
    catch(error){
        return res.status(500).json(`send otp error ${error}`)
    }
}
export const verifyOtp=async(req,res)=>{
    try{
      const{email,otp}=req.body
      const user=await User.findOne({email})
      if(!user || user.resetOtp!=otp || user.otpExpires<Date.now()) {
        return res.status(400).json({message:"invalid/expired otp"})
      }
      user.isOtpVerified=true
      user.resetOtp=undefined
      user.otpExpires=undefined
      await user.save()
      return res.status(200).json({message:"otp verify successfully"})
    }
    catch(error){
     return res.status(500).json(`send otp error ${error}`)
    }
}
export const resetPassword=async(req,res)=>{
    try{
        const{email,newPassword}=req.body
        const user=await User.findOne({email})

        if(!user || !user.isOtpVerified){
           return res.status(400).json({message:"OTP VERIFICATION REQUIRD"})
        }
        const hassPassword=await bcrypt.hash(newPassword,10)
        user.password=hassPassword
       
        user.isOtpVerified=false
         await user.save()
         return res.status(200).json({message:"password reset successfully"})
    }
    catch(error){
return res.status(500).json(`reset password error ${error.message}`)
    
    }
}
export const googleAuth=async(req,res)=>{
try{
    const {email,fullName,mobile,role}=req.body
let user=await User.findOne({email})
if(!user){
    user=await User.create({
        email,
        fullName,
        mobile,
        role
    })
}
const token=await gentoken(user._id);
res.cookie("token",token,{

secure:false,//production me true karna
sameSite:"strict",
maxAge:7*24*60*60*1000,//7 days
httpOnly:true

    })
    res.status(201).json(user);
}
catch(error){
return res.status(500).json(`google auth error ${error}`)
}


}