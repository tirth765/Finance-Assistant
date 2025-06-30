import {
    GET_NOTIFICATIONS,
    NOTIFICATION_ERROR,
    ADD_NOTIFICATION,
    DELETE_NOTIFICATION,
    MARK_AS_READ,
    UPDATE_NOTIFICATION_PREFERENCES
} from '../../actions/types';

const initialState = {
    notifications: [],
    preferences: {
        email: true,
        push: true,
        budgetAlerts: true,
        expenseAlerts: true,
        goalAlerts: true
    },
    loading: true,
    error: {}
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_NOTIFICATIONS:
            return {
                ...state,
                notifications: payload,
                loading: false
            };
        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [payload, ...state.notifications],
                loading: false
            };
        case DELETE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter(
                    notification => notification._id !== payload
                ),
                loading: false
            };
        case MARK_AS_READ:
            return {
                ...state,
                notifications: state.notifications.map(notification =>
                    notification._id === payload ? { ...notification, read: true } : notification
                ),
                loading: false
            };
        case UPDATE_NOTIFICATION_PREFERENCES:
            return {
                ...state,
                preferences: { ...state.preferences, ...payload },
                loading: false
            };
        case NOTIFICATION_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    }
} 