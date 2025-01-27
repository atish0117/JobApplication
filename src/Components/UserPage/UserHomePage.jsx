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
import { IoIosAddCircleOutline } from "react-icons/io";
// import Faq from './component/Faq';
// import FilterModal from './component/FilterModal';
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  fetchAllUserProfiles,
} from "../../Redux/features/PostServiceF";
import { useNavigate } from "react-router-dom";
import config from "../../appWrite/config";
import { Databases } from "appwrite";
import client from "../../appWrite/AppwriteConfigPost";
import ProfileComponent from "./profileComponent";
const UserHomePage = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const { profile, role, loading, error, profiles, status } = useSelector(
    (state) => state.form
  );
  console.log("all user profile", profiles);

  const fetchJobPosts = async () => {
    try {
      const databases = new Databases(client);

      // Replace "DATABASE_ID" and "COLLECTION_ID" with your Appwrite IDs
      const response = await databases.listDocuments(
        config.appwriteDatabaseId, // Database ID
        config.appwriteJobPostId // Collection ID
      );
      console.log("all job", response.documents);
      setJobPosts(response.documents);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchUserProfile());
    fetchJobPosts();
  }, [dispatch]);
  console.log("data", profile);

  useEffect(() => {
    dispatch(fetchAllUserProfiles());
  }, [dispatch]);

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate); // Set the selected candidate's details
  };

  const handleBackToProfiles = () => {
    setSelectedCandidate(null); // Clear the selected candidate and return to the list view
  };
  if (status === "loading") return <p>Loading user profiles...</p>;
  // if (status === "failed") return <p>Error: {error}</p>;
  console.log("jobspost",jobPosts)
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-lvh mx-5 lg:mx-20 py-5">
        <ProfileComponent/>
        {/* Jobs Section */}
        <div className="jobs-by-skills flex flex-col grow bg-white py-5 px-3 lg:px-5 shadow-xl rounded border border-black w-full lg:overflow-y-scroll">
          {/* <JobPost role={role} /> */}

          {/* Search Bar */}
          <div className="search-bar w-full flex justify-between mb-5">
            <Link to={"/jobpost"}>
              {profile?.role === "Employer" ? (
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-white text-sm md:text-base lg:text-lg rounded-lg hover:bg-slate-700 transition-all duration-300 w-full md:w-[180px]">
                  <IoIosAddCircleOutline className="text-lg md:text-xl" />
                  Create Job
                </button>
              ) : (
                ""
              )}
            </Link>
            <Link to={"/searchcomponent"}>
              <span className="flex items-center gap-2 p-2 rounded-full border bg-slate-600 hover:bg-slate-700 transition-all duration-300 border-gray-500">
                <CiSearch className="text-xl font-extrabold text-white lg:text-3xl" />
              </span>
            </Link>
          </div>

          {/* Job Listings */}
          {role === "Employee" && (
            <div className="skill-job-list flex flex-col">
              <div className="filter flex justify-between items-center mb-5">
                <span className="text-lg lg:text-3xl">
                  Jobs matching your skills
                </span>
              </div>
              {jobPosts?.map((jobs, idx) => (
                <div
                  key={idx}
                  className="w-full shadow-xl mt-5 p-5 rounded border border-black"
                >
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <span className="h-16 w-16 lg:h-20 lg:w-20 border border-black rounded-full bg-center bg-contain overflow-hidden">
                        <img src={`${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${jobs.jobFile}/view?project=${config.appwriteProjectId}`}
                        alt={jobs.jobTitle}
                        className="w-20 h-20 "
                        />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-lg lg:text-2xl">
                          {jobs.jobTitle}
                        </span>
                        <span>{jobs.companyName}</span>
                      </div>
                    </div>
                    <CiBookmarkPlus className="text-xl lg:text-3xl" />
                  </div>
                  <div className="flex justify-between mt-3">
                    <div className="flex gap-3 items-center">
                      <CiClock2 className="text-lg lg:text-2xl" />
                      <span className="text-sm lg:text-lg">{jobs.time}</span>
                      <CiMoneyBill className="text-lg lg:text-2xl ms-3" />
                      <span className="text-sm lg:text-lg">{jobs.salary}</span>
                      <CiLocationOn className="text-lg lg:text-2xl ms-3" />
                      <span className="text-sm lg:text-lg">
                        {jobs.location}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/job/${jobs.$id}`, { state: { jobs } })
                      }
                      className="bg-gray-800 text-white px-3 py-2 rounded"
                    >
                      Job Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {role === "Employer" && (
            <div className="max-w-full mx-auto p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
              // Candidate List View
              <div>
                <h2 className="text-2xl font-semibold text-center mb-6 underline">
                  Candidate Profiles
                </h2>
                {profiles?.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No user profiles found.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profiles?.map((profile) => (
                      <Link
                        to={`/viewProfile/${profile?.$id}`}
                        key={profile?.$id}
                        className="p-4 border border-gray-300 rounded-md shadow-md cursor-pointer"
                        onClick={() => handleCandidateClick(profile)}
                      >
                        <h3 className="text-xl font-bold">
                          <strong className="text-sm text-gray-600">
                            Name:
                          </strong>{" "}
                          {profile?.FullName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <strong>Email:</strong> {profile?.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Skills:</strong>{" "}
                          {profile?.skills?.join(", ") || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Experience:</strong>{" "}
                          {profile?.experience || "N/A"}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="bg-gray-100 border-t border-gray-300 p-10 mt-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700">
          {/* <!-- Section 1: About --> */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Job Portal</h3>
            <p className="text-sm">
              Job Portal is a platform designed to connect job seekers with the
              best opportunities in the industry. Our mission is to make job
              hunting simple, efficient, and rewarding.
            </p>
          </div>

          {/* <!-- Section 2: Quick Links --> */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-500">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Post a Job
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* <!-- Section 3: Resources --> */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-500">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* <!-- Section 4: Contact --> */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm mb-2">
              <i className="fas fa-map-marker-alt"></i> New Industrial Township,
              Faridabad
            </p>
            <p className="text-sm mb-2">
              <i className="fas fa-envelope"></i> support@jobportal.com
            </p>
            <p className="text-sm mb-2">
              <i className="fas fa-phone"></i> +91 9810454218
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-500 hover:text-blue-500">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-500">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-500">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-500">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-300 pt-4 text-center text-sm text-gray-500">
          <p>© 2025 Job Portal. All rights reserved.</p>
          <p>Designed with ❤ by Aaditya Rana</p>
        </div>
      </footer>
    </>
  );
};

export default UserHomePage;
