import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import ChangePassword from './Components/auth/ChangePassword';
import ForgotPassword from './Components/auth/ForgotPassword';
import Login from './Components/auth/Login';
import ResetPasswordSuccess from './Components/auth/PasswordResetSuccess';
import ResetPassword from './Components/auth/ResetPassword';
import DomainCheck from './Components/DomainCheck';
import ClippedDrawer from './Components/Drawer';
import './ReactToast.css';
import store from './state/store';
const App = () => {
   return (
      <Provider store={store}>
         <BrowserRouter>
            <Routes>
               <Route path='/' element={<DomainCheck />} />
               <Route path='/forgot-password' element={<ForgotPassword />} />
               <Route path='/reset-password' element={<ResetPassword />} />
               <Route path='/change-password' element={<ChangePassword />} />
               <Route path='/login' element={<Login />} />
               <Route path='/reset-password-success' element={<ResetPasswordSuccess />} />
               <Route path='*' element={
                  <>
                     <ClippedDrawer />
                     <Routes>
                     </Routes>
                  </>
               } />
            </Routes>
            {/* <Footer/> */}
            <ToastContainer
               position="bottom-center"
               autoClose={5000}
               hideProgressBar={true}
               newestOnTop={false}
               closeOnClick
               rtl={false}
               pauseOnFocusLoss={false}
               draggable
               pauseOnHover
               theme='colored'
            />
         </BrowserRouter>
      </Provider>
   )
}

export default App;
