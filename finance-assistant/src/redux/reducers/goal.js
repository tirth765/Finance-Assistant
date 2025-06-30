import {
    GET_GOALS,
    GOAL_ERROR,
    ADD_GOAL,
    DELETE_GOAL,
    UPDATE_GOAL,
    UPDATE_GOAL_PROGRESS
} from '../../actions/types';

const initialState = {
    goals: [],
    loading: true,
    error: {}
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_GOALS:
            return {
                ...state,
                goals: payload,
                loading: false
            };
        case ADD_GOAL:
            return {
                ...state,
                goals: [payload, ...state.goals],
                loading: false
            };
        case DELETE_GOAL:
            return {
                ...state,
                goals: state.goals.filter(goal => goal._id !== payload),
                loading: false
            };
        case UPDATE_GOAL:
            return {
                ...state,
                goals: state.goals.map(goal =>
                    goal._id === payload._id ? payload : goal
                ),
                loading: false
            };
        case UPDATE_GOAL_PROGRESS:
            return {
                ...state,
                goals: state.goals.map(goal =>
                    goal._id === payload._id
                        ? { ...goal, progress: payload.progress }
                        : goal
                ),
                loading: false
            };
        case GOAL_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    }
} 