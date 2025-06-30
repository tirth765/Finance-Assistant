import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from "../../utils/api/axiosInstance";
import { API_ENDPOINTS } from "../../utils/api/constants";

export const getReview = createAsyncThunk(
    'review/getReview',
    async() => {
        const response = await axios.get('http://localhost:8000/api/v1/review/get');
        console.log('Review data from API:',response.data);
        return response.data.data;
    })
// Post a new review
export const postReview = createAsyncThunk(
    'review/postReview',
    async (data) => {
      const response = await axios.post('http://localhost:8000/api/v1/review/post', data);
      return response.data.data; // ✅ Fix: return the actual review object
    }
  );
  

// Update review (helpful/unhelpful or others)
export const updateReview = createAsyncThunk(
    'review/updateReview', 
    async ({id, data}, {rejectWithValue}) => {
    try {
        const response = await axiosInstance.put(`${API_ENDPOINTS.REVIEW.BASE}/${id}`, data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
});

// Slice
const ReviewSlice = createSlice({
    name: 'review',
    initialState: {
        review: [],
        loading: false,
        error: null
    },
    reducers: {
        clearReviewError:(state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder

            // Get Reviews
            .addCase(getReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReview.fulfilled, (state, action) => {
                state.review = action.payload;
                state.loading = false;
            })
            .addCase(getReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Post Review
            .addCase(postReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postReview.fulfilled, (state, action) => {
                if (!state.review) {
                  state.review = []; // defensive fallback
                }
                state.review.push(action.payload);
                state.loading = false;
              })              
            .addCase(postReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Review
            .addCase(updateReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                const index = state.review.findIndex(
                    (r) => (r.id || r._id) === (action.payload.id || action.payload._id)
                );
                if (index !== -1) {
                    state.review[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const {clearReviewError} = ReviewSlice.actions;
export default ReviewSlice.reducer;