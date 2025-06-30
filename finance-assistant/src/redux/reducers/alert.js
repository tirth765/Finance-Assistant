import { SET_ALERT, REMOVE_ALERT } from '../../actions/types';

// Action creator for setting alerts
export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    const id = Math.random().toString(36).substr(2, 9);
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};

const initialState = [];

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
} 