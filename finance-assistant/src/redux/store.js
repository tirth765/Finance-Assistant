// import { combineReducers } from 'redux'
import { configureStore } from "@reduxjs/toolkit"
import { 
    AddExpenseSlice, 
    SignupSlice, 
    BudgetSlice, 
    TransactionSlice, 
    NotificationSlice, 
    GoalSlice,
    ReviewSlice,
} from "./Slice"

// Create the store with reducers
export const store = configureStore({
    reducer: {
        addExpense: AddExpenseSlice,
        signup: SignupSlice,
        budget: BudgetSlice,
        transaction: TransactionSlice,
        notification: NotificationSlice,
        goal: GoalSlice,
        review: ReviewSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})