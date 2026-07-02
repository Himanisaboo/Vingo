import React from 'react'
import {Routes,Route, Navigate} from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import useGetCurrentUser from './hooks/useGetCurrentUser.jsx'
import { useSelector } from 'react-redux'
import Home from './pages/Home.jsx'
import useGetCity from './hooks/useGetCity.jsx'
import useGetMyShop from './hooks/useGetMyShop.jsx'
import CreateEditShop from './pages/CreateEditShop.jsx'
import AddItem from './pages/AddItem.jsx'
import EditItem from './pages/EditItem.jsx'
import {useNavigate}  from "react-router-dom";
import useGetShopByCity from './hooks/useGetShopByCity.jsx'
import useGetItemsByCity from './hooks/useGetItemsByCity.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckOut from './pages/CheckOut.jsx'
import OrderPlaced from './pages/OrderPlaced.jsx'
import MyOrders from './pages/MyOrders.jsx'
import useGetMyOrders from './hooks/useGetMyOrders.jsx'
import useUpdateLocation from './hooks/useUpdateLocation.jsx'
import TrackOrderPage from './pages/TrackOrderPage.jsx'
import Shop from './pages/Shop.jsx'
import { useEffect } from 'react'
import { io } from "socket.io-client";
import { useDispatch } from 'react-redux'
import { setSocket } from './redux/userSlice.js'
export const serverUrl="http://localhost:8000"
function App() {
  useGetCurrentUser()
  useGetCity()
  useGetMyShop()
  useGetShopByCity()
  useGetItemsByCity()
  useGetMyOrders()
  useUpdateLocation()
  const {userData}=useSelector(state=>state.user)
  const dispatch=useDispatch()
  useEffect(()=>{
const socketInstance=io(serverUrl,{withCredentials:true})
dispatch(setSocket(socketInstance))
socketInstance.on("connect",()=>{
  if(userData){
    socketInstance.emit('identity',{userId:userData._id})
  } 
})
return()=>{
  socketInstance.disconnect()
}
  },[userData?._id])
  return (
    <Routes>
       <Route path='/signup' element={!userData?<SignUp />:<Navigate to={"/"} />} />
       <Route path='/signin' element={!userData?<SignIn />:<Navigate to={"/"}/>} />
       <Route path='/forgot-password' element={!userData?<ForgotPassword /> :<Navigate to={"/"}/>}/>
       <Route path='/' element={userData?<Home/>:<Navigate to={"/signin"}/>} />
       <Route path='/create-edit-shop' element={userData?<CreateEditShop/>:<Navigate to={"/signin"}/>} />
       <Route path='/add-item' element={userData?<AddItem/>:<Navigate to={"/signin"}/>} />
       <Route path='/edit-item/:itemId' element={userData?<EditItem/>:<Navigate to={"/signin"}/>} />
       <Route path='/cart' element={userData?<CartPage/>:<Navigate to={"/signin"}/>} />
       <Route path='/checkout' element={userData?<CheckOut/>:<Navigate to={"/signin"}/>} />
       <Route path='/order-placed' element={userData?<OrderPlaced/>:<Navigate to={"/signin"}/>} />
       <Route path='/my-orders' element={userData?<MyOrders/>:<Navigate to={"/signin"}/>} />
       <Route path='/track-order/:orderId' element={userData?<TrackOrderPage/>:<Navigate to={"/signin"}/>} />
       <Route path='/shop/:shopId' element={userData?<Shop/>:<Navigate to={"/signin"}/>} />
      </Routes>
  )

}

export default App