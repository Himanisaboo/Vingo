import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";
import MyOrders from "../pages/MyOrders";

const userSlice=createSlice({  //ek function hota h redux ke andr
    name:"user",
    initialState:{
        userData:null,
        currentCity:null,
        currentState:null,
        currentAddress:null,
        shopsInMyCity:null,
        itemsInMyCity:null,
        cartItems:[],
        totalAmount:0,
        myOrders:null
    },
    //changes ke liye reducers bnate h    
    reducers:{
        setUserData:(state,action)=>{
         state.userData=action.payload//payload is fancy name of data
        },
        setCurrentCity:(state,action)=>{
            state.currentCity=action.payload
        },
        setCurrentState:(state,action)=>{
            state.currentState=action.payload
        },
setCurrentAddress:(state,action)=>{
            state.currentAddress=action.payload
        },
        setShopsInMyCity:(state,action)=>{
            state.shopsInMyCity=action.payload
        },
        setItemsInMyCity:(state,action)=>{
            state.itemsInMyCity=action.payload
        },
        setItemsInMyCity:(state,action)=>{
            state.itemsInMyCity=action.payload
        },
        addToCart:(state,action)=>{
           const cartItem=action.payload
           const existingItem=state.cartItems.find(i=>i.id==cartItem.id)
           if(existingItem){
             existingItem.quantity+=cartItem.quantity
           }
           else{
            state.cartItems.push(cartItem)
           }
          state.totalAmount=state.cartItems.reduce((sum,i)=>sum+(i.price*i.quantity),0)
        },
         updateQuantity:(state,action)=>{
            const {id,quantity}=action.payload
            const item=state.cartItems.find(i=>i.id==id)
            if(item){
                item.quantity=quantity
            } 
          state.totalAmount=state.cartItems.reduce((sum,i)=>sum+(i.price*i.quantity),0)

         },
         removeCardItem:(state,action)=>{
           
             state.cartItems=state.cartItems.filter(i=>i.id!==action.payload)
          state.totalAmount=state.cartItems.reduce((sum,i)=>sum+(i.price*i.quantity),0)
            
         },
         setMyOrders:(state,action)=>{
            state.myOrders=action.payload
         },
       
        addMyOrder:(state,action)=>{
            state.myOrders=[action.payload,...state.myOrders]
        },
        updateOrderStatus:(state,action)=>{
            const {orderId,shopId,status}=action.payload
            const order=state.myOrders.find(o=>o._id==orderId)
            if(order){
               if(order.shopOrders && order.shopOrders[0].shop._id==shopId){
                order.shopOrders[0].status=status
               } 
            }
        }

        }

    
    })
    export const {setUserData,setCurrentCity,setCurrentState,setCurrentAddress,setShopsInMyCity,setItemsInMyCity,addToCart,updateQuantity,removeCardItem,setMyOrders,addMyOrder,updateOrderStatus}=userSlice.actions
    export default userSlice.reducer
