import React from 'react'
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";   
import { CiTrash } from "react-icons/ci"; 
import { useDispatch } from 'react-redux';
import { removeCardItem, updateQuantity } from '../redux/userSlice';
function CardItemCard({data}) {
    const dispatch=useDispatch()
    const handleIncrease=(id,currentQty)=>{
       dispatch(updateQuantity({id,quantity:currentQty+1}))
    }
    const handleDecrease=(id,currentQty)=>{
        if(currentQty>0){

        
        dispatch(updateQuantity({id,quantity:currentQty-1}))}
    }
  return (
    
    <div className='w-full flex items-center justify-between bg-white p-5 rounded-xl shadow-md border mb-4'>
  
  <div className='flex items-center gap-4'>
    <img
      src={data.image}
      alt={data.name}
      className='w-24 h-24 object-cover rounded-lg border'
    />

    <div>
      <h1 className='font-semibold text-lg text-gray-800'>
        {data.name}
      </h1>

      <p className='text-gray-500'>
        ₹{data.price} × {data.quantity}
      </p>

      <p className='font-bold text-[#ff4d2d] text-lg'>
        ₹{data.price * data.quantity}
      </p>
    </div>
  </div>

  <div className='flex items-center gap-3'>
    <button
      className='p-2 bg-gray-100 rounded-full hover:bg-gray-200'
      onClick={() => handleDecrease(data.id, data.quantity)}
    >
      <FaMinus size={12} />
    </button>

    <span className='font-semibold text-lg min-w-[20px] text-center'>
      {data.quantity}
    </span>

    <button
      className='p-2 bg-gray-100 rounded-full hover:bg-gray-200'
      onClick={() => handleIncrease(data.id, data.quantity)}
    >
      <FaPlus size={12} />
    </button>

    <button className='p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200' onClick={()=>dispatch(removeCardItem(data.id))}>
      <CiTrash size={18} />
    </button>
  </div>

</div>)
}

export default CardItemCard