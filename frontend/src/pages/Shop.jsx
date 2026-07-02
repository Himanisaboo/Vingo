import React from 'react'
import { useParams } from 'react-router-dom';
import { serverUrl } from '../App.jsx';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaStore } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6"; 
import { FaUtensils } from "react-icons/fa";
import FoodCard from '../components/FoodCard';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
function Shop() {
    const {shopId}=useParams()
    const [items,setItems]=useState([])
    const [shop,setShop]=useState(null)
    const navigate=useNavigate()
    const handleShop=async()=>{
        try{
        const result=await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`,{withCredentials:true})
        setShop(result.data.shop)
        setItems(result.data.items)
        }
        catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
    handleShop()
    },[shopId])
return(
    <div className='min-h-screen bg-gray-50'>
        <button className='absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-full shadow transition' onClick={() => navigate("/")}>
<FaArrowLeft />
<span>
Back
</span>
        </button>
        {shop && <div className='relative w-full h-64 md:h-80 lg:h-96'>
            <img src={shop.image} alt={shop.name} className='w-full h-full object-cover' />
<div className='absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex flex-col text-center px-4 items-center justify-center'>
<FaStore className='text-white text-4xl mb-3 drop-shadow-md' />
<h1 className='text-white text-3xl md:text-5xl font-entrabold drop-shadow-lg'>{shop.name}</h1>
<div className="flex items-center justify-center gap-[10px]">
    <FaLocationDot size={22} color="red"/>
 <p className='text-gray-200 text-lg font-medium mt-[10px]'>{shop.address}</p>
 </div>
    </div>
   
            </div>}



            <div className='max-w-7xl mx-auto px-6 py-10'>
              <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-10 text-gray-800">
                <FaUtensils  color="red"/>
                Our Menu
              </h2>

              {items.length>0 ?(
<div className='flex flex-wrap justify-center gap-8'>
    {items.map((item)=>{
        return <FoodCard data={item}/>
    })}
    </div>
              ):(<p className='text-gray-500 text-lg text-center'>No items available</p>)}
            </div>

    </div>
)


}
export default Shop