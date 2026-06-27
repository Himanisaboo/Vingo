import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice"
import ownerSlice from "./ownerSlice"
import mapSlice from "./mapSlice.js"
export const store=configureStore({   // mostly function object lete h
    reducer:{
        user:userSlice,
        owner:ownerSlice,
        map:mapSlice
    }
})