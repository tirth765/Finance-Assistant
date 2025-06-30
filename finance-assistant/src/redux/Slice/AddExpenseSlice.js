import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


export const getAddExpense = createAsyncThunk(
    'addExpense/getAddExpense',
    async () => {
        const response = await axios.get('http://localhost:8000/addExpense');
        console.log(response.data);
        return response.data;
    }
)

export const setAddExpense = createAsyncThunk(
    'addExpense/setAddExpense',
    async (data) => {
        const response = await axios.post('http://localhost:8000/addExpense', data);
        console.log(response.data);
        return response.data;
    }
)

// export const deleteMyProfile = createAsyncThunk(
//     'myProfile/deleteMyProfile',
//     async (id) => {
//         const response = await axios.delete('http://localhost:8000/myProfile/' + id);
//         return id;
//     }
// )

// export const editMyProfile = createAsyncThunk(
//     'myProfile/editMyProfile',
//     async (data) => {
//         const response = await axios.put('http://localhost:8000/myProfile/' + data.id, data);

//         return response.data;
//     })


const initialState = {
    isLoding: false,
    addExpense: [],
    error: null
}

const AddExpenseSlice = createSlice({
    name: 'addExpense',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getAddExpense.fulfilled, (state, action) => {
            state.addExpense = action.payload
        })
        builder.addCase(setAddExpense.fulfilled, (state, action) => {
            state.addExpense = state.addExpense.concat(action.payload)
        })
        // builder.addCase(deleteMyProfile.fulfilled, (state, action) => {
        //     state.myProfile = state.myProfile.filter((v) => v.id !== action.payload)
        // })
        // builder.addCase(editMyProfile.fulfilled, (state, action) => {
        //     state.myProfile = state.myProfile.map((v) => {
        //         if (v.id === action.payload?.id) {
        //             return action.payload
        //         } else {
        //             return v
        //         }
        //     })
        // })

    }
})

export default AddExpenseSlice.reducer;
