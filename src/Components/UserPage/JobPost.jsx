import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaDollarSign,
  FaMapMarkerAlt,
  FaClipboard,
  FaTasks,
  FaClock,
  FaPen,
  FaTimes,
} from "react-icons/fa"; // Importing icons
import { SlBookOpen } from "react-icons/sl";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../Redux/features/PostServiceF";
import { Databases, Query, ID,Storage } from "appwrite";
import config from "../../appWrite/config";
import client from "../../appWrite/AppwriteConfigPost";
import { useNavigate } from "react-router-dom";

const JobPost = () => {
  // State for form inputs
  const [jobPosts, setJobPosts] = useState([]);
  const [skillInput, setSkillInput] = useState(""); // Input for adding a skill
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    jobTitle: "",
    companyName: "",
    sector: "",
    time: "",
    salary: "",
    experience: "",
    location: "",

    jobDescription: "",
    keyResponsibility: "",
    professionalSkills: [],
    jobFile: null, // New field for file upload
  });

  const dispatch = useDispatch();
  const { profile, role, loading, error } = useSelector((state) => state.form);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setJobData({ ...jobData, jobFile: file || "default.txt" }); // Set default file name if no file selected
  };

  const handleAddSkill = () => {
    if (skillInput.trim() !== "") {
      setJobData((prev) => ({
        ...prev,
        professionalSkills: [...prev.professionalSkills, skillInput.trim()],
      }));
      setSkillInput(""); // Clear the input after adding
    }
  };

  const handleRemoveSkill = (index) => {
    setJobData((prev) => ({
      ...prev,
      professionalSkills: prev.professionalSkills.filter(
        (_, i) => i !== index
      ),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const databases = new Databases(client);
      const storage = new Storage(client);

      // Handle file upload or use default value
      let fileUploadResponse = null;
      if (jobData.jobFile && typeof jobData.jobFile !== "string") {
        // Upload file to Appwrite storage

        fileUploadResponse = await storage.createFile(
          config.appwriteBucketId,
          ID.unique(),
          jobData.jobFile
        );
      }

      const projectData = {
        ...jobData,
        jobFile: fileUploadResponse
          ? fileUploadResponse.$id // Use uploaded file ID
          : "default.txt", // Use default value
      };

      // Create Job Post in Appwrite
      const projectResponse = await databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteJobPostId,
        ID.unique(),
        projectData
      );
      console.log("Job Post created successfully:", projectResponse);

      // Associate Job Post with Employer (rest of your logic remains the same)
      const email = localStorage.getItem("Token");
      const userResponse = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionIdEmployerProfileId,
        [Query.equal("email", email)]
      );

      if (userResponse.documents.length > 0) {
        const userId = userResponse.documents[0].$id;

        const updatedJobPosts = [
          ...(userResponse.documents[0].jobPosts || []),
          projectResponse.$id,
        ];

        await databases.updateDocument(
          config.appwriteDatabaseId,
          config.appwriteCollectionIdEmployerProfileId,
          userId,
          { jobPosts: updatedJobPosts }
        );

        console.log("Job Post linked to user profile successfully!");
      } else {
        console.error("Employer profile not found for the given email.");
      }

      // Reset form and update local state
      setJobPosts([...jobPosts, { ...jobData, id: projectResponse.$id }]);
      setJobData({
        jobTitle: "",
        companyName: "",
        sector: "",
        time: "",
        salary: "",
        experience: "",
        location: "",
        jobDescription: "",
        keyResponsibility: "",
        professionalSkills: [],
        jobFile: null,
      });
      navigate("/userhomepage");
    } catch (error) {
      console.error("Error creating job post:", error.message);
    }
  };

  if (role !== "Employer") {
    return null;
  }

  return (
    <div className="max-w-full mx-auto my-8 p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Create Job Post
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Input Fields */}
         
          {[
            { id: "jobTitle", icon: FaPen, placeholder: "Job Title" },
            {
              id: "companyName",
              icon: FaBuilding,
              placeholder: "Company Name",
            },
            { id: "sector", icon: FaClipboard, placeholder: "Sector" },
            { id: "location", icon: FaMapMarkerAlt, placeholder: "Location" },
            { id: "experience", icon: SlBookOpen, placeholder: "experience" },
          ].map(({ id, icon: Icon, placeholder }) => (
            <div key={id} className="flex items-center space-x-2">
              <Icon className="text-gray-500" />
              <input
                type="text"
                id={id}
                name={id}
                value={jobData[id]}
                onChange={handleChange}
                placeholder={placeholder}
                className="p-3 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
          ))}

            {/* Professional Skills Input */}
            <div>
            <label className="text-sm font-medium mb-2 block">
              Professional Skills
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill"
                className="p-3 border border-gray-300 rounded-md w-full"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <div className="mt-4 space-x-2 flex flex-wrap">
              {jobData.professionalSkills.map((skill, index) => (
                <span
                  key={index}
                  className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full space-x-2"
                >
                  <span>{skill}</span>
                  <FaTimes
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleRemoveSkill(index)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Time Dropdown */}
          <div className="flex items-center space-x-2">
            <FaClock className="text-gray-500" />
            <select
              id="time"
              name="time"
              value={jobData.time}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md w-full"
              required
            >
              <option value="" disabled>
                Select Job Time
              </option>
              {["Full-Time", "Part-Time", "Night-Shift", "Day-Shift"].map(
                (time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Salary Dropdown */}
          <div className="flex items-center space-x-2">
            <FaDollarSign className="text-gray-500" />
            <select
              id="salary"
              name="salary"
              value={jobData.salary}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md w-full"
              required
            >
              <option value="" disabled>
                Select Salary Range
              </option>
              {[
                "10,000 - 20,000",
                "20,000 - 30,000",
                "30,000 - 40,000",
                "40,000 - 50,000",
                "50,000 - 60,000",
                "60,000 - 70,000",
                "70,000 - 80,000",
                "80,000 - 90,000",
                "1 Lakh",
                "1.5 - 2 Lakhs",
                "2 - 2.5 Lakhs",
                "2.5 - 3 Lakhs",
                "Above 10 Lakhs",
              ].map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>
          {/* Text Areas */}
          {[
            { id: "jobDescription", label: "Job Description" },
            { id: "keyResponsibility", label: "Key Responsibilities" },
          ].map(({ id, label }) => (
            <div key={id} className="flex flex-col space-y-2">
              <label className="text-sm font-medium" htmlFor={id}>
                {label}
              </label>
              <textarea
                id={id}
                name={id}
                value={jobData[id]}
                onChange={handleChange}
                placeholder={label}
                className="p-3 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
          ))}
          {/* File Input */}
          <div className="flex items-center space-x-2">
            <FaTasks className="text-gray-500" />
            <input
              type="file"
              id="jobFile"
              name="jobFile"
              // accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="p-3 border border-gray-300 rounded-md w-full"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-[#0e1822] text-white font-medium rounded-md hover:bg-[#ff4655] transition duration-300 w-full sm:w-auto"
            >
              Create Job Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobPost;
