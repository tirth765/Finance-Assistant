import {
    GET_REVIEW,
    GET_REVIEW_SUCCESS,
    GET_REVIEW_FAILURE,
    POST_REVIEW_REQUEST,
    POST_REVIEW_FAILURE,
    POST_REVIEW_SUCCESS,
    UPDATE_REVIEW_REQUEST,
    UPDATE_REVIEW_SUCCESS,
    UPDATE_REVIEW_FAILURE,
} from '../../actions/types'

const initialState = {
    review: [],
    loading: false,
    error: null
  };
  

  const reviewReducer = (state = initialState, action) => {
    const {type, payload} = action;
    switch (type) {
      case 'GET_REVIEW_REQUEST':
      case 'POST_REVIEW_REQUEST':
      case 'UPDATE_REVIEW_REQUEST':
        return {
          ...state,
          review:payload,
          loading: true,
          error: null
        };
  
      case 'GET_REVIEW_SUCCESS':
        return {
          ...state,
          loading: false,
          review: action.payload
        };
  
      case 'POST_REVIEW_SUCCESS':
        return {
          ...state,
          loading: false,
          review: [...state.review, action.payload]
        };
  
      case 'UPDATE_REVIEW_SUCCESS':
        return {
          ...state,
          loading: false,
          review: state.review.map((r) =>
            r.id === action.payload.id ? action.payload : r
          )
        };
  
      case 'GET_REVIEW_FAILURE':
      case 'POST_REVIEW_FAILURE':
      case 'UPDATE_REVIEW_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload
        };
  
      default:
        return state;
    }
  };
  
  export default reviewReducer;
  