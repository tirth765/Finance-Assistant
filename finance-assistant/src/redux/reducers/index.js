import { combineReducers } from "redux";
import authReducer from "./auth";
import alertReducer from "./alert";
import budgetReducer from "./budget";
import transactionReducer from "./transaction";
import goalReducer from "./goal";
import notificationReducer from "./notification";
import reviewReducer from "./review";

export const rootReducer = combineReducers({
    auth: authReducer,
    alert: alertReducer,
    budget: budgetReducer,
    transaction: transactionReducer,
    goal: goalReducer,
    notification: notificationReducer,
    review: reviewReducer,
});