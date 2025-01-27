import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Databases, Storage } from "appwrite";
import config from "../../appWrite/config";
import client from "../../appWrite/AppwriteConfigPost";
import {
  FaBuilding,
  FaDollarSign,
  FaMapMarkerAlt,
  FaClipboard,
  FaTasks,
  FaClock,
  FaPen,
  FaTimes,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { SlBookOpen } from "react-icons/sl";
const JobDetailPage = () => {
  const { jobId } = useParams(); // Get the job ID from the URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreviewURL, setImagePreviewURL] = useState("");
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const databases = new Databases(client);
        const storage = new Storage(client);

        // Fetch job details
        const response = await databases.getDocument(
          config.appwriteDatabaseId,
          config.appwriteJobPostId,
          jobId
        );
        setJob(response);

        // Generate image preview URL if `jobFile` exists
        if (response.jobFile) {
          const previewURL = storage.getFileView(
            config.appwriteBucketId,
            response.jobFile
          );
          setImagePreviewURL(previewURL);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);
  console.log("jobdetail", job);
  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job details not found!</div>;

  const handleScroll = (section) => {
    setActiveSection(section); // Update the active section
    const element = document.getElementById(section);
    element.scrollIntoView({
      behavior: "smooth", // For smooth scrolling
      block: "start", // Aligns the element at the top of the container
    });
  };

  return (
    <div className="flex justify-center  w-full bg-yellow-100 ">
      <div className="component"></div>
      <div className="p-6 max-w-3xl mx-auto  bg-white shadow-md rounded">
        <div className=" w-full py-2 ">
          <div className="w-full h-[300px]  flex pl-8 ">
            {/* Display Job Image Preview if it exists */}
            {imagePreviewURL && (
              <div className="img mt-6 w-1/4 flex flex-col justify-start items-center ">
                {/* <h2 className="text-xl font-bold mb-2">Job File Preview</h2> */}
                <div className="rounded-full bg-slate-500 overflow-hidden flex items-center justify-center w-40 h-40">
                  <img
                    src={imagePreviewURL}
                    alt="Job File Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-base font-semibold mb-2 px-2 py-1 bg-yellow-100 rounded-lg mt-2">
                  {" "}
                  {job.companyName}
                </p>
              </div>
            )}
            <div className="details w-full ml-8  flex flex-col justify-center ">
              <p className="title text-xl font-bold">{job.jobTitle}</p>
              <p className="location text-base mb-2 flex items-center">
                <span className="mr-2">
                  <FaMapMarkerAlt />
                </span>{" "}
                {job.location}
              </p>
              <div className="flex">
                <div>
                  <p className="salary text-base mb-2">
                    Salary
                    <span className="mr-2 flex text-base items-center">
                      <FaMoneyBillAlt className="mr-2" />
                      {job.salary}
                    </span>{" "}
                  </p>
                  <p className="time text-base mb-2">
                    JobType:
                    <span className="mr-2 text-base flex items-center">
                      <FaClock className="mr-2" />
                      {job.time}
                    </span>{" "}
                  </p>
                </div>
                <div className="ml-6">
                  <p className="sector mb-2 text-base">
                    Sector:
                    <span className="mr-2 text-base flex items-center">
                      <FaClipboard className="mr-2" />
                      {job.sector}
                    </span>{" "}
                  </p>
                  <p className="skills mb-5 text-base font-medium">
                    Experience:
                    <span className="mr-2 text-base flex items-center">
                      <SlBookOpen className="mr-2" />
                      {job.experience} Years
                    </span>
                  </p>
                </div>
              </div>
              <div className="professionalSkills">
                <h2 className="mb-5 text-base  font-medium">
                  professional Skills:
                </h2>
                {job.professionalSkills?.map((professionalSkill, index) => (
                  <span
                    key={index}
                    className=" text-base bg-yellow-100 text-black px-4 py-1 rounded-3xl mr-2 mb-2 inline-block"
                  >
                    {professionalSkill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="details-2 w-full">
      <div className="Job_name w-full flex space-x-4 p-4">
        <button
          className={`text-xl font-bold mb-2 mr-7 cursor-pointer px-4 py-2 rounded ${
            activeSection === "job_Description"
              ? "bg-yellow-200 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleScroll("job_Description")}
        >
          Key Responsibilities
        </button>
        <button
          className={`text-xl font-bold mb-2 cursor-pointer px-4 py-2 rounded ${
            activeSection === "Key_responsibilities"
              ? "bg-yellow-200 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleScroll("Key_responsibilities")}
        >
          Job Description
          
        </button>
      </div>
      <div className="w-full h-64 overflow-y-auto">
        <div id="job_Description" className="job_Description w-full mb-4">
          <h2 className="text-xl font-bold mb-2">Key Responsibilities</h2>
          <p className="break-words">{job.keyResponsibility}</p>
        </div>
        <div
          id="Key_responsibilities"
          className="Key_responsibilities w-full mb-4"
        >
          <h2 className="text-xl font-bold mb-2">Job Description</h2>
          <p className="break-words">{job.jobDescription}ghggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg</p>
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
