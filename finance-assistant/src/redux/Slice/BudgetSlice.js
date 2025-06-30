import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../utils/api/axiosInstance";
import { API_ENDPOINTS } from "../../utils/api/constants";

export const getBudgets = createAsyncThunk(
    'budget/getBudgets',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.BUDGET.LIST);
            console.log('Budget data from API:', response.data);
            return response.data.data; // Return the data property from the response
        } catch (error) {
            console.error('Error fetching budgets:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch budgets');
        }
    }
);

export const postBudget = createAsyncThunk(
    'budget/postBudget',
    async (data) => {
        console.log(' bch  bhxc cxkk',data);
        const response = await axios.post('http://localhost:8000/api/v1/budget/add',data,{
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            //   }   
        });
        console.log('nkjvfnvkndfkl',response.data);
        return response.data;
    }
)

export const addBudget = createAsyncThunk(
    'budget/addBudget',
    async (data, { rejectWithValue }) => {
        try {
            console.log('Sending budget data to API:', data);
            const response = await axiosInstance.post(API_ENDPOINTS.BUDGET.ADD, data);
            console.log('API response:', response.data);
            return response.data.data; // Return the budget object from the response
        } catch (error) {
            console.error('API error:', error.response || error);
            return rejectWithValue(error.response?.data?.message || 'Failed to add budget');
        }
    }
);

export const updateBudget = createAsyncThunk(
    'budget/updateBudget',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`${API_ENDPOINTS.BUDGET.BASE}/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update budget');
        }
    }
);

export const deleteBudget = createAsyncThunk(
    'budget/deleteBudget',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`${API_ENDPOINTS.BUDGET.BASE}/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete budget');
        }
    }
);

export const getBudgetAnalysis = createAsyncThunk(
    'budget/getAnalysis',
    async (dateRange, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.BUDGET.ANALYSIS, { params: dateRange });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch budget analysis');
        }
    }
);

const initialState = {
    budgets: [],
    analysis: null,
    loading: false,
    error: null
};

const BudgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        clearBudgetError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBudgets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBudgets.fulfilled, (state, action) => {
                state.loading = false;
                state.budgets = action.payload;
            })
            .addCase(getBudgets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addBudget.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBudget.fulfilled, (state, action) => {
                state.loading = false;
                state.budgets.push(action.payload);
            })
            .addCase(addBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateBudget.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBudget.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.budgets.findIndex(budget => budget._id === action.payload._id);
                if (index !== -1) {
                    state.budgets[index] = action.payload;
                }
            })
            .addCase(updateBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteBudget.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBudget.fulfilled, (state, action) => {
                state.loading = false;
                state.budgets = state.budgets.filter(budget => budget._id !== action.payload);
            })
            .addCase(deleteBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getBudgetAnalysis.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBudgetAnalysis.fulfilled, (state, action) => {
                state.loading = false;
                state.analysis = action.payload;
            })
            .addCase(getBudgetAnalysis.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearBudgetError } = BudgetSlice.actions;
export default BudgetSlice.reducer; 