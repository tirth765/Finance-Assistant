import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

export const getNotifications = createAsyncThunk(
    'notification/getNotifications',
    async () => {
        const response = await axios.get('http://localhost:8000/notification');
        return response.data;
    }
);

export const addNotification = createAsyncThunk(
    'notification/addNotification',
    async (data) => {
        const response = await axios.post('http://localhost:8000/notification', data);
        return response.data;
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notification/markAsRead',
    async (id) => {
        const response = await axios.put(`http://localhost:8000/notification/${id}/read`);
        return response.data;
    }
);

export const deleteNotification = createAsyncThunk(
    'notification/deleteNotification',
    async (id) => {
        await axios.delete(`http://localhost:8000/notification/${id}`);
        return id;
    }
);

export const updateNotificationPreferences = createAsyncThunk(
    'notification/updatePreferences',
    async (preferences) => {
        const response = await axios.put('http://localhost:8000/notification/preferences', preferences);
        return response.data;
    }
);

const initialState = {
    notifications: [],
    preferences: {
        email: true,
        push: true,
        budgetAlerts: true,
        expenseAlerts: true,
        goalAlerts: true
    },
    loading: false,
    error: null
};

const NotificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        clearNotificationError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addNotification.fulfilled, (state, action) => {
                state.notifications.unshift(action.payload);
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(notification => notification._id === action.payload._id);
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                }
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.notifications = state.notifications.filter(notification => notification._id !== action.payload);
            })
            .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
                state.preferences = action.payload;
            });
    }
});

export const { clearNotificationError } = NotificationSlice.actions;
export default NotificationSlice.reducer; 