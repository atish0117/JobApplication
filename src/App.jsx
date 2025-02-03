import React from 'react'
import { Outlet} from 'react-router-dom';
import Navbar from "./Components/Navbar"
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./Redux/features/AuthserviceF";
import AuthCheck from './Components/AuthServicePage/AuthCheck.jsx';

import { useEffect } from 'react';
export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <>
    <AuthCheck />
    {/* <Provider store={store}> */}
    <Outlet/>
    {/* </Provider> */}
    
    </>
  )
}
