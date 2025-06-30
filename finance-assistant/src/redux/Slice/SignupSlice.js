import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

export const postSignupData = createAsyncThunk(
    'register/postSignupData',
    async (data) => {
        console.log(' bch  bhxc cxkk',data);
        const response = await axios.post('http://localhost:8000/api/v1/signupData/register',data,{
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            //   }   
        });
        console.log('nkjvfnvkndfkl',response.data);
        return response.data;
    }
)

export const userLogin = createAsyncThunk (
    'auth/userLogin',

    async (data) => {

        const response = await axios.post(BASE_URL + "users/login", data, { withCredentials: true })

        console.log(response.data);

        if(response.data.success) {
            return response.data.data
        }
    }
)

// export const CreateCategory = createAsyncThunk(
//     "Category/CreateCategory",
//     async (data) => {
//         console.log(data);
        
//         const response = await axios.post('http://localhost:8000/api/v1/category/post-category', data, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//               }
//         });
//         console.log(response.data);
//         return response.data.data;
//     }
// )
// export const postLoginpData = createAsyncThunk(
//     'signup/postLoginData',
//     async () => {
//         const response = await axios.get('http://localhost:8000/api/v1/signupData/login');
//         console.log(response.data);
//         return response.data;
//     }
// )

export const setSignupData = createAsyncThunk(
    'signup/setSignupData',
    async (data) => {
        const response = await axios.get('http://localhost:8000/api/v1/signupData/generateNewTokens', data);
        console.log(response.data);
        return response.data;
    }
)

const initialState = {
    signupData: [],
    loading: false,
    error: null
};

const SignupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
        clearSignupError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(postSignupData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postSignupData.fulfilled, (state, action) => {
                state.loading = false;
                state.signupData = action.payload;
            })
            .addCase(postSignupData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(setSignupData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setSignupData.fulfilled, (state, action) => {
                state.loading = false;
                state.signupData.push(action.payload);
            })
            .addCase(setSignupData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { clearSignupError } = SignupSlice.actions;
export default SignupSlice.reducer;