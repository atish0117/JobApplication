import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../Redux/features/AuthserviceF";

const AuthCheck = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("Token");

      if (token) {
         dispatch(getCurrentUser()); // Fetch user details if logged in
        navigate("/userhomepage"); // Redirect to homepage
      } else {
        navigate("/"); // Redirect to login page if no token
      }
    };

    checkUser();
  }, [dispatch, navigate, isLoggedIn]);

  return null; // This component does not render anything
};

export default AuthCheck;
