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
      <div className="max-w-6xl">
        {profile ? (
          <div className="profile bg-white flex flex-col shadow-xl p-5 rounded-xl border border-black w-full lg:w-full">
            {/* Edit Button */}

            <div className="edit-btn flex justify-between items-center mb-5">
              <span className="border border-black px-2 py-1 rounded flex items-center gap-2">
                <CiLight className="text-xl lg:text-2xl text-[#ff4655]" />
                Status: Looking for job
              </span>
              <Link to={"/newprofile"}>
                <CgProfile className="text-xl lg:text-3xl" />
              </Link>
            </div>

            {/* Avatar */}
            <div className="profile-avatar flex justify-center mb-5">
              <span className="w-36 h-36 lg:w-52 lg:h-52 border border-black rounded-full bg-center bg-cover">
                <img
                  src={profile.profileImageUrl}
                  alt="Profile"
                  className="profile-image w-full h-full rounded-full"
                />
              </span>
            </div>

            {/* Profile Details */}
            <div className="profile-details flex flex-col justify-between flex-grow">
              {role === "Employee" && (
                <>
                  <div className="flex flex-col gap-3">
                    <span className="flex text-base lg:text-lg gap-2">
                      <CiUser className="text-xl lg:text-2xl" /> Name:{" "}
                      <span>{profile.FullName}</span>
                    </span>
                    <span className="flex text-base lg:text-lg gap-2">
                      <CiMail className="text-xl lg:text-2xl" /> Email:{" "}
                      <span>{profile.email}</span>
                    </span>
                    <span className="flex text-base lg:text-lg gap-2">
                      <CiPhone className="text-xl lg:text-2xl" /> Phone no:{" "}
                      <span>{profile.Contact}</span>
                    </span>
                    <span className="flex text-base lg:text-lg gap-2">
                      <CiLocationOn className="text-xl lg:text-2xl" /> Address:{" "}
                      <span>{profile.Address}</span>
                    </span>
                    <span className="flex text-base lg:text-lg gap-2 flex-wrap">
                      <CiMedal className="text-xl lg:text-2xl" /> Skills:
                      {profile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-700 text-white px-2 py-1 rounded ms-2"
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
                    <span className="flex text-base lg:text-lg gap-2">
                      <CiUser className="text-xl lg:text-2xl" /> Name:{" "}
                      <span>{profile.FullName}</span>
                    </span>
                    <span className="flex text-base lg:text-lg gap-2">
                      <CiMail className="text-xl lg:text-2xl" /> Email:{" "}
                      <span>{profile.email}</span>
                    </span>
                    <span className="flex text-base lg:text-lg gap-2">
                      <CiPhone className="text-xl lg:text-2xl" /> Phone no:{" "}
                      <span>{profile.Contact}</span>
                    </span>
                    <span className="flex text-base lg:text-lg gap-2">
                      <CiLocationOn className="text-xl lg:text-2xl" /> POST:{" "}
                      <span>{profile.post}</span>
                    </span>
                    <span className="flex text-base lg:text-lg gap-2 flex-wrap ">
                      <CiMedal className="text-xl lg:text-2xl" /> Skills: <br />
                      <span className="flex-wrap">{profile.skills}</span>
                    </span>
                  </div>
                </>
              )}
              <button className="mt-5 bg-[#ff4655] text-white  rounded">
                {user != null ? (
                  <div>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut} // Disable button when logging out
                      className={`w-full px-4 py-2 transition ${
                        isLoggingOut
                          ? "bg-red-300 cursor-not-allowed"
                          : "bg-red-400"
                      }`}
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                ) : (
                  <Link to={"/login"}></Link>
                )}
              </button>
            </div>
          </div>
        ) : (
          <p>No profile found.</p>
        )}
      </div>
    </>
  );
};

export default ProfileComponent;
