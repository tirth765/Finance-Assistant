import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

export const getGoals = createAsyncThunk(
    'goal/getGoals',
    async () => {
        const response = await axios.get('http://localhost:8000/goal');
        return response.data;
    }
);

export const addGoal = createAsyncThunk(
    'goal/addGoal',
    async (data) => {
        const response = await axios.post('http://localhost:8000/goal', data);
        return response.data;
    }
);

export const updateGoal = createAsyncThunk(
    'goal/updateGoal',
    async ({ id, data }) => {
        const response = await axios.put(`http://localhost:8000/goal/${id}`, data);
        return response.data;
    }
);

export const deleteGoal = createAsyncThunk(
    'goal/deleteGoal',
    async (id) => {
        await axios.delete(`http://localhost:8000/goal/${id}`);
        return id;
    }
);

export const updateGoalProgress = createAsyncThunk(
    'goal/updateProgress',
    async ({ id, progress }) => {
        const response = await axios.put(`http://localhost:8000/goal/${id}/progress`, { progress });
        return response.data;
    }
);

const initialState = {
    goals: [],
    loading: false,
    error: null
};

const GoalSlice = createSlice({
    name: 'goal',
    initialState,
    reducers: {
        clearGoalError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getGoals.pending, (state) => {
                state.loading = true;
            })
            .addCase(getGoals.fulfilled, (state, action) => {
                state.loading = false;
                state.goals = action.payload;
            })
            .addCase(getGoals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addGoal.fulfilled, (state, action) => {
                state.goals.push(action.payload);
            })
            .addCase(updateGoal.fulfilled, (state, action) => {
                const index = state.goals.findIndex(goal => goal._id === action.payload._id);
                if (index !== -1) {
                    state.goals[index] = action.payload;
                }
            })
            .addCase(deleteGoal.fulfilled, (state, action) => {
                state.goals = state.goals.filter(goal => goal._id !== action.payload);
            })
            .addCase(updateGoalProgress.fulfilled, (state, action) => {
                const index = state.goals.findIndex(goal => goal._id === action.payload._id);
                if (index !== -1) {
                    state.goals[index] = action.payload;
                }
            });
    }
});

export const { clearGoalError } = GoalSlice.actions;
export default GoalSlice.reducer; 