import { createSlice } from "@reduxjs/toolkit";




const QuantitySlice = createSlice({
    name: 'quantity',
    initialState:{},
    reducers: {
        cart:(state,action)=>{
          return action.payload;
        },
        increase: (state, action) => {
           return action;
        },
        decrease: (state, action) => {
            console.log(state, action)
        }
    }
});


export const { increase, decrease,cart } = QuantitySlice.actions;

export default QuantitySlice.reducer;