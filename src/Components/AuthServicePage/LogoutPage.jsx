import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/features/AuthserviceF";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout()).then(() => {
      navigate("/login"); // Redirect to login page after logout
    });
  }, [dispatch, navigate]);

  return <p>Logging out...</p>;
};

export default LogoutPage;
