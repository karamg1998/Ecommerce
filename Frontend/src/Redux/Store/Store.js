import { configureStore } from "@reduxjs/toolkit";
import QuantitySlice from "../Slices/Quantity";

export const Store=configureStore({
   reducer:{
        Quantity:QuantitySlice
   }
});