// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const AdminRoute = () => {
//     const { user, isAdmin } = useSelector((state) => state.auth);
//     const navigate = useNavigate();
    
//     // Redirect to admin page if user is admin
//     if (isAdmin) {
//         return <p>Welcome Admin!</p>;
//     }
    
//     // Redirect to user dashboard if not an admin
//     if (user) {
//         return <p>Welcome, {user.name}!</p>;
//     }
    
//     // If no user, redirect to login page
//     navigate("/login");
//     return null;
// };
// export default AdminRoute;
