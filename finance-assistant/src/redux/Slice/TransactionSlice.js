import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

export const getTransactions = createAsyncThunk(
    'transaction/getTransactions',
    async () => {
        const response = await axios.get('http://localhost:8000/transaction');
        return response.data;
    }
);

export const addTransaction = createAsyncThunk(
    'transaction/addTransaction',
    async (data) => {
        const response = await axios.post('http://localhost:8000/transaction', data);
        return response.data;
    }
);

export const updateTransaction = createAsyncThunk(
    'transaction/updateTransaction',
    async ({ id, data }) => {
        const response = await axios.put(`http://localhost:8000/transaction/${id}`, data);
        return response.data;
    }
);

export const deleteTransaction = createAsyncThunk(
    'transaction/deleteTransaction',
    async (id) => {
        await axios.delete(`http://localhost:8000/transaction/${id}`);
        return id;
    }
);

export const getTransactionCategories = createAsyncThunk(
    'transaction/getCategories',
    async () => {
        const response = await axios.get('http://localhost:8000/transaction/categories');
        return response.data;
    }
);

const initialState = {
    transactions: [],
    categories: [],
    loading: false,
    error: null
};

const TransactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        clearTransactionError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTransactions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.transactions.unshift(action.payload);
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                const index = state.transactions.findIndex(transaction => transaction._id === action.payload._id);
                if (index !== -1) {
                    state.transactions[index] = action.payload;
                }
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.transactions = state.transactions.filter(transaction => transaction._id !== action.payload);
            })
            .addCase(getTransactionCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            });
    }
});

export const { clearTransactionError } = TransactionSlice.actions;
export default TransactionSlice.reducer; 