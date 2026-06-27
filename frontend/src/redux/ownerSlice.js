import { createSlice } from "@reduxjs/toolkit";

const ownerSlice=createSlice({  //ek function hota h redux ke andr
    name:"user",
    initialState:{
        myShopData:null,
        
    },
    //changes ke liye reducers bnate h
    reducers:{
        setMyShopData:(state,action)=>{
         state.myShopData=action.payload//payload is fancy name of data
        },
        
        }
    
    })
    export const {setMyShopData}=ownerSlice.actions
    export default ownerSlice.reducer
