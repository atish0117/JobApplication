import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import App from './App.jsx'; 
import  Home  from './Pages/Home.jsx';
import EmployeeForm from './Components/MultiForm2/EmployeeForm.jsx'
import EmployerForm from './Components/MultiForm2/EmployerForm.jsx'
import RoleProtectedRoute from './Components/AuthServicePage/RoleProtectedRoute.jsx'
import Unauthorized from './Components/AuthServicePage/Unauthorized.jsx'
import RoleSelector from './Components/MultiForm2/RoleSelector.jsx'
import LoginPage from "./Components/AuthServicePage/LoginPage.jsx"
import SignupPage from "./Components/AuthServicePage/SignupPage.jsx"
import PasswordResetPage from "./Components/AuthServicePage/PasswordResetPage.jsx"
import VerificationPage from "./Components/AuthServicePage/VerificationPage.jsx"
import PasswordRecoveryPage from "./Components/AuthServicePage/PasswordRecoveryPage.jsx"
// import AdminDashboard from './Admin/AdminDashboard.jsx';
import { Provider } from 'react-redux';
import AuthServiceStore from "./Redux/AuthServiceStore.jsx"
import CheckEmailVerificationStatus from './Components/AuthServicePage/CheckEmailVerificationStatus.jsx';
import ProfilePage from "./Components/UserPage/ProfilePage.jsx"
import UserHomePage from './Components/UserPage/UserHomePage.jsx';
import  Newprofile  from './Components/UserPage/Newprofile.jsx';
import JobPost from './Components/UserPage/JobPost.jsx';
import JobDetailPage from './Components/UserPage/JobDetailPage.jsx';
import SearchComponent from './Components/SearchComponent.jsx';
import ViewProfile from './Components/UserPage/ViewProfile.jsx';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: '',
        element:
        <Home />
      },
      // {
      //   path: "/admin-dashboard",
      //   element:
      //   <RoleProtectedRoute allowedRoles={["admin"]}>
      //         <AdminDashboard />
      //       </RoleProtectedRoute>
      // },
      {
        path: '/Login',
        element:
        <LoginPage />
      },
      {
        path: '/Signup',
        element: <SignupPage />
      },
      {
        path: "/reset-password",
        element: <PasswordResetPage />
      },
      {
        path: '/verify-email',
        element: <VerificationPage />
      },
      {
        path: "/recover-password",
        element:<PasswordRecoveryPage />
      },
      {
        path: "/CheckEmailVerificationStatus",
        element:<CheckEmailVerificationStatus />
      },
      {
        path: "/unauthorized",
        element:<Unauthorized  />
      },
      {
        path: '/EmployeeForm',
        element: <EmployeeForm />
      },
      {
        path: '/EmployerForm',
        element: <EmployerForm />
      },
      {
        path: '/profilepage',
        element: <ProfilePage />
      },
      {
        path: '/jobpost',
        element: <JobPost />
      },
      {
        path: '/userhomepage',
        element: <UserHomePage />
      },
      {
        path: '/newprofile',
        element: <Newprofile />
      },
      {
        path: "/job/:jobId",
        element: <JobDetailPage />
      },
      {
        path:"/viewProfile/:candidateId",
        element: <ViewProfile />
      },
      {
        path: "/searchcomponent",
        element: <SearchComponent />
      },
      {
        path: '/RoleSelector',
        element: <RoleSelector />
      },
    ]
  }
  ])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={AuthServiceStore}>

     <RouterProvider router={router} />
     </Provider>
  </StrictMode>,
)
