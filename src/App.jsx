import React from 'react'
import { Outlet} from 'react-router-dom';
import Navbar from "./Components/Navbar"
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./Redux/features/AuthserviceF";
import { useEffect } from 'react';
export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <>
    <Navbar/>
    {/* <Provider store={store}> */}
    <Outlet/>
    {/* </Provider> */}
    
    </>
  )
}
