import React,{useEffect} from "react";
import { Link , useNavigate} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout ,getCurrentUser} from "../Redux/features/AuthserviceF";
import authService from "../appWrite/AppwriteConfig";


const Navbar = () => {
  const { user, loading,isLoggedIn, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log("isLoggedIn:", isLoggedIn);
  console.log("User:", user);
  
  // console.log("Username ",user.name)
  const handleLogout = async () => {
    try {
      await authService.account.deleteSession("current");
      localStorage.removeItem("Token");
     
      dispatch(logout());
      navigate("/");
      
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };
  
  // useEffect(() => {
  //   // Ensure user data is hydrated on page load
  //   dispatch(getCurrentUser());
  // }, [dispatch]);

  return (
    
  <nav className="flex justify-between items-center p-4 bg-blue-600 text-white">
  <div className="text-xl font-bold">MyApp</div>
  <div>
    {user!=null ? (
      <div className="flex items-center gap-4">
        <span>Welcome, {user.email}</span>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 rounded">
          Logout
        </button>
      </div>
    ) : (
      <div className="flex gap-4">
        <a href="/login" className="px-4 py-2 bg-green-500 rounded">Login</a>
        <a href="/signup" className="px-4 py-2 bg-blue-500 rounded">Signup</a>
      </div>
    )}
  </div>
</nav>
);

};

export default Navbar;
