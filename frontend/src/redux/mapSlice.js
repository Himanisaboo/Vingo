import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const mapSlice=createSlice({  //ek function hota h redux ke andr
    name:"user",
    initialState:{
        location:{
            lat:null,
            lon:null
        },
        address:null
    },
    //changes ke liye reducers bnate h    
    reducers:{
       setLocation:(state,action)=>{
        const {lat,lon}=action.payload
        state.location.lat=lat
        state.location.lon=lon
       },
       setAddress:(state,action)=>{
        state.address=action.payload
       }

        }

    
    })
    export const {setAddress,setLocation}=mapSlice.actions
    export default mapSlice.reducer
