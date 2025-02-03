import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  fetchAllUserProfiles,
} from "../../Redux/features/PostServiceF";
import { Link, useNavigate } from "react-router-dom";
import config from "../../appWrite/config";
import { Databases } from "appwrite";
import client from "../../appWrite/AppwriteConfigPost";
import {
  CiEdit,
  CiUser,
  CiMail,
  CiPhone,
  CiMedal,
  CiLocationOn,
  CiSearch,
  CiFilter,
  CiBookmarkPlus,
  CiMoneyBill,
  CiClock2,
  CiLight,
} from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import Newprofile from "./Newprofile";
import authService from "../../appWrite/AppwriteConfig";
import { logout, getCurrentUser } from "../../Redux/features/AuthserviceF";

const ProfileComponent = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, role, loading, error, profiles, status } = useSelector(
    (state) => state.form
  );
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  console.log("all user profile", profiles);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  console.log("data", profile);

  const handleLogout = async () => {
    setIsLoggingOut(true); // Disable button immediately
    try {
      await authService.account.deleteSession("current");
      localStorage.removeItem("Token");
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.log("Logout failed", error.message);
      setIsLoggingOut(false); 
    }
  };

  return (
    <>
    <div className="max-w-6xl mx-auto sticky top-4">
  {profile ? (
    <div className="profile bg-white flex flex-col shadow-xl p-6 rounded-xl border border-gray-200 w-full lg:w-full">
      {/* Edit Button and Status */}
      <div className="edit-btn flex justify-between items-center mb-6">
        <span className="border border-gray-300 px-3 py-2 rounded-lg flex items-center gap-2 text-sm lg:text-base">
          <CiLight className="text-xl lg:text-2xl text-[#ff4655]" />
          Status: Looking for job
        </span>
        <Link to="/newprofile" className="hover:opacity-80 transition-opacity">
          <CgProfile className="text-2xl lg:text-3xl text-gray-700" />
        </Link>
      </div>

      {/* Avatar */}
      <div className="profile-avatar flex justify-center mb-6">
        <div className="w-36 h-36 lg:w-52 lg:h-52 border-4 border-gray-200 rounded-full overflow-hidden">
          <img
            src={profile.profileImageUrl || "/default-profile.png"} // Fallback image
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Profile Details */}
      <div className="profile-details flex flex-col gap-4">
        {role === "Employee" && (
          <>
            <div className="flex flex-col gap-3">
              <span className="flex items-center text-base lg:text-lg gap-2">
                <CiUser className="text-xl lg:text-2xl text-gray-500" />
                Name: <span className="font-medium">{profile.FullName}</span>
              </span>
              <span className="flex items-center text-base lg:text-lg gap-2">
                <CiMail className="text-xl lg:text-2xl text-gray-500" />
                Email: <span className="font-medium">{profile.email}</span>
              </span>
              <span className="flex items-center text-base lg:text-lg gap-2">
                <CiPhone className="text-xl lg:text-2xl text-gray-500" />
                Phone no: <span className="font-medium">{profile.Contact}</span>
              </span>
              <span className="flex items-center text-base lg:text-lg gap-2">
                <CiLocationOn className="text-xl lg:text-2xl text-gray-500" />
                Address: <span className="font-medium">{profile.Address}</span>
              </span>
              <span className="flex items-center text-base lg:text-lg gap-2 flex-wrap">
                <CiMedal className="text-xl lg:text-2xl text-gray-500" />
                Skills:
                {profile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm lg:text-base ml-2"
                  >
                    {skill}
                  </span>
                ))}
              </span>
            </div>
          </>
        )}
        {role === "Employer" && (
          <>
            <div className="flex flex-col gap-3">
              <span className="flex items-center text-base lg:text-lg gap-2">
                <CiUser className="text-xl lg:text-2xl text-gray-500" />
                Name: <span className="font-medium">{profile.FullName}</span>
              </span>
              <span className="flex items-center text-base lg:text-lg gap-2">
                <CiMail className="text-xl lg:text-2xl text-gray-500" />
                Email: <span className="font-medium">{profile.email}</span>
              </span>
              <span className="flex items-center text-base lg:text-lg gap-2">
                <CiPhone className="text-xl lg:text-2xl text-gray-500" />
                Phone no: <span className="font-medium">{profile.Contact}</span>
              </span>
              <span className="flex items-center text-base lg:text-lg gap-2">
                <CiLocationOn className="text-xl lg:text-2xl text-gray-500" />
                POST: <span className="font-medium">{profile.post}</span>
              </span>
            </div>
          </>
        )}
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        {user != null ? (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full px-4 py-2 rounded-lg text-white font-medium transition ${
              isLoggingOut
                ? "bg-red-300 cursor-not-allowed"
                : "bg-[#ff4655] hover:bg-[#e53e3e]"
            }`}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        ) : (
          <Link
            to="/login"
            className="block w-full px-4 py-2 bg-[#ff4655] text-white text-center rounded-lg hover:bg-[#e53e3e] transition"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  ) : (
    <p className="text-center text-gray-600">No profile found.</p>
  )}
</div>
    </>
  );
};

export default ProfileComponent;
