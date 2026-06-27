import React, { useState } from 'react'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App.jsx';
import axios from 'axios';
import {auth} from '../../firebase.js'
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {ClipLoader} from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
function SignIn() {
    const primaryColor = '#ff4d2d';
    const hoverColor = '#e64323';
    const bgColor='#fff9f6';
    const borderColor='#ddd';
const [showPassword,setShowPassword]=useState(false)
const navigate=useNavigate()
const [email,setEmail]=useState('')
const [password,setPassword]=useState('')
const[err,setErr]=useState('')
const[loading,setLoading]=useState(false)
const dispatch=useDispatch()
const handleSignIn=async()=>{
  setLoading(true)
  try{
    const result=await axios.post(`${serverUrl}/api/auth/signin`,{
      email,password
    },{withCredentials:true})
    dispatch(setUserData(result.data))
    setErr("")
    setLoading(false)
  }  
  catch(error){
    setErr(error?.response?.data?.message)
    setLoading(false)
  }
}
const handleGoogleAuth = async () => {
  try {
    

    const provider = new GoogleAuthProvider();
    const googleResult = await signInWithPopup(auth, provider);

    const user = googleResult.user;

    const {data} = await axios.post(
      `${serverUrl}/api/auth/google-auth`,
      {
        email: user.email,
      },
      { withCredentials: true }
    );

    dispatch(setUserData(data))
  } catch (error) {
    console.log(error)
  }
};
  return (
    
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ backgroundColor: bgColor }}>
        <div className={`bg-white rounded-xl shadow-lg max-w-md w-full shadow-md p-8 border-[1px]`} style={{border:`1px solid ${borderColor}`}}>

            <h1 className={`text-3xl font-bold mb-2`} style={{color:primaryColor}}>Vingo</h1>
            <p className="text-gray-600 mb-8">Create your account to get started with delicious food deliveries.</p>
            
              
             <div className='mb-4'>
              <label htmlFor='email' className='block text-gray-700 font-medium mb-1'>Email</label>
              <input type="email" className='w-full border rounded-lg px-3 py-2 focus:outline-none ' placeholder='Enter your Email ' style={{border:`1px solid ${borderColor}`}} value={email} onChange={(e) => setEmail(e.target.value)} required/>
               
            </div>
            
            <div className='mb-4'>
              <label htmlFor='password' className='block text-gray-700 font-medium mb-1'>Password</label>
              <div className='relative'>
              
              <input type={showPassword ? "text" : "password"} className='w-full border rounded-lg px-3 py-2 focus:outline-none ' placeholder='Enter your Password' style={{border:`1px solid ${borderColor}`}} value={password} required  onChange={(e) => setPassword(e.target.value)}/>
              <button className='absolute right-3 cursor-pointer top-[14px] text-gray-500' onClick={() => setShowPassword(prev=>!prev)}>
                {!showPassword?<FaRegEye />:<FaRegEyeSlash />}</button>
               </div>
              
            </div>
       <div className='text-right mb-4 text-[#ff4d2d] font medium cursor-pointer' onClick={()=>navigate("/forgot-password")}>
        Forgot Password
        </div>  
<button className={`w-full  font-semibold py-2 border rounded-lg py-2 transition-duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323]`} onClick={handleSignIn}>
  {loading ? <ClipLoader size={20} color="#fff" /> : "Sign In"}
</button>
{err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}
<button className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition-duration-200 border-gray-400 cursor-pointer hover:bg-gray-100' onClick={handleGoogleAuth} disabled={loading}>
  <FcGoogle size={20}/> 

  <span>
    Sign In with google
  </span>
</button>
<p className='text-center mt-6 cursor-pointer' onClick={()=>navigate("/signup")}>
  Want to create a new Account? 
  <span className="text-[#ff4d2d] hover:underline">
    Sign Up
  </span>
</p>

            </div>
            

    </div>
  
)
}
export default SignIn