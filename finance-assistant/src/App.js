import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import UserRoute from "./Route/UserRoute";
import PublicRoute from "./Route/PublicRoute";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import NotificationReminder from "./Container/NotificationReminder/NotificationReminder";
import Review from "./Container/Review/Review";

const App = () => {
  return (
    // <>
    // {/* <Review/> */}
    // {/* // <NotificationReminder /> */}
    // {/* // //  <Calendar /> */}
  // {/* //  / {//* //  <DailyExpenseChart /> */} 
    //  </>
    <Provider store={store}>
      <Router future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true 
      }}>
        <Routes>
          <Route path="/*" element={<PublicRoute />} />
          <Route path="/dashboard/*" element={<UserRoute />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </Provider>
  );
}

export default App;
