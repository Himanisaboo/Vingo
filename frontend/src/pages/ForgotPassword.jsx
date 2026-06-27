import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { serverUrl } from '../App.jsx';
import axios from 'axios';
import {ClipLoader} from "react-spinners"
function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err,setErr]=useState("")
  const[loading,setLoading]=useState(false)
  const navigate = useNavigate();
  
  const handleSendOtp = async () => {
    setLoading(true)
    try{
       const result=await axios.post(`${serverUrl}/api/auth/send-otp`,{email},
        {withCredentials:true})
        console.log(result)
       setStep(2)
       setErr("")
       setLoading(false)
    }
    catch(error){
      setErr(error.response.data.message)
      setLoading(false)
    }
  }
  const handleVerifyOtp = async () => {
    try{
       const result=await axios.post(`${serverUrl}/api/auth/verify-otp`,{email,otp},
        {withCredentials:true})
        console.log(result)
       setStep(3)
       setErr('')
    }
    catch(error){
       setErr(error?.response?.data?.message)
    }
  }
  const handleResetPassword = async () => {
    try{
      if(newPassword!==confirmPassword){
        setErr("Passwords do not match");
        return null
      }
       const result=await axios.post(`${serverUrl}/api/auth/reset-password`,{email,newPassword},
        {withCredentials:true})
        console.log(result)
       navigate("/signin")
       setErr('')
    }
    catch(error){
       setErr(error?.response?.data?.message)
    }
  }
  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-6">
          <IoMdArrowRoundBack
            size={20}
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate("/signin")}
          />

          <h1 className="text-2xl font-bold text-[#ff4d2d]">
            Forgot Password
          </h1>
        </div>

        {/* STEP 1 - EMAIL */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>

              <input
                type="email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              onClick={() => handleSendOtp()}
              className="w-full font-semibold py-2 rounded-lg bg-[#ff4d2d] text-white hover:bg-[#e64323]"
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "Send OTP"}
            </button>
           {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}
          </div>
        )}

        {/* STEP 2 - OTP */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                OTP
              </label>

              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />    
            </div>

            <button
              onClick={()=>handleVerifyOtp()}
              className="w-full font-semibold py-2 rounded-lg bg-[#ff4d2d] text-white hover:bg-[#e64323]"
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "Verify OTP"}
            </button>
            {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}
          </div>
        )}

        {/* STEP 3 - RESET PASSWORD */}
        {step === 3 && (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                New Password
              </label>

              <input
                type="password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>

              <input
                type="password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button className="w-full font-semibold py-2 rounded-lg bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor pointer" onClick={()=>handleResetPassword()}>
              {loading ? <ClipLoader size={20} color="#fff" /> : "Reset Password"}
            </button>
            {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}

          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;