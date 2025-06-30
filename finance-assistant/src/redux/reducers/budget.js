import {
    GET_BUDGETS,
    BUDGET_ERROR,
    ADD_BUDGET,
    DELETE_BUDGET,
    UPDATE_BUDGET
} from '../../actions/types';

const initialState = {
    budgets: [],
    loading: true,
    error: {}
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_BUDGETS:
            return {
                ...state,
                budgets: payload,
                loading: false
            };
        case ADD_BUDGET:
            return {
                ...state,
                budgets: [payload, ...state.budgets],
                loading: false
            };
        case DELETE_BUDGET:
            return {
                ...state,
                budgets: state.budgets.filter(budget => budget._id !== payload),
                loading: false
            };
        case UPDATE_BUDGET:
            return {
                ...state,
                budgets: state.budgets.map(budget =>
                    budget._id === payload._id ? payload : budget
                ),
                loading: false
            };
        case BUDGET_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    }
} 