// import React, { useState,useEffect } from 'react';
// import { FaBuilding, FaDollarSign, FaMapMarkerAlt, FaClipboard, FaTasks, 
//     // FaSkills,
//      FaClock, FaPen } from 'react-icons/fa'; // Importing icons
//      import { useSelector,useDispatch } from 'react-redux';
//      import { fetchUserProfile } from "../../Redux/features/PostServiceF";
//      import { Databases, Query,Account,ID } from "appwrite";
//      import config from "../../appWrite/config";
//      import client from "../../appWrite/AppwriteConfigPost";

// const JobPost = () => {

//   // State for form inputs
//   const [jobPosts, setJobPosts] = useState([])
//   const [jobData, setJobData] = useState({
//     jobTitle: '',
//     companyName: '',
//     sector: '',
//     time: '',
//     salary: '',
//     location: '',
//     jobDescription: '',
//     keyResponsibility: '',
//     professionalSkills: '',
//   });

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setJobData({ ...jobData, [name]: value });
//   };

//   // Handle form submission
//   const handleSubmit = async(e) => {
//     e.preventDefault();
//     // Handle job post creation here (e.g., send data to an API or backend)
//     console.log('Job Post Created:', jobData);

    
//     try {
//       const databases = new Databases(client);
//       const storage = new Storage(client);


//       // Create project in the Project Collection
//       const projectResponse = await databases.createDocument(
//         config.appwriteDatabaseId,
//         config.appwriteJobPostId,
//         ID.unique(),
//         {
//           jobTitle: jobData.jobTitle,
//           companyName: jobData.companyName,
//           sector: jobData.sector,
//           time: jobData.time,
//           salary: jobData.salary,
//           location: jobData.location,
//           jobDescription: jobData.jobDescription,
//           keyResponsibility: jobData.keyResponsibility,
//           professionalSkills: jobData.professionalSkills,
         
//         }
//       );
//       console.log("Project created successfully:", projectResponse);

//       // Associate the project with the user
//       const email = localStorage.getItem("Token");
//       const userResponse = await databases.listDocuments(
//         config.appwriteDatabaseId,
//         config.appwriteCollectionIdEmployerProfileId,
//         [Query.equal("email", email)]
//       );

//       if (userResponse.documents.length > 0) {
//         const userId = userResponse.documents[0].$id;

//         // Add the new project ID to the user's `projects` key
//         const updatedJobPosts = [
//           ...(userResponse.documents[0].jobPosts || []),
//           JobPostResponse.$id,
//         ];

//         await databases.updateDocument(
//           config.appwriteDatabaseId,
//           config.appwriteCollectionIdEmployerProfileId,
//           userId,
//           { jobPosts: updatedJobPosts }
//         );
//       }

//       // Update local state and reset form
//       setJobPosts([...jobPosts, { ...jobData, id: JobPostResponse.$id }]);
//       setJobData({
//         jobTitle: '',
//         companyName: '',
//         sector: '',
//         time: '',
//         salary: '',
//         location: '',
//         jobDescription: '',
//         keyResponsibility: '',
//         professionalSkills: '',
//       });

//       console.log("Project added successfully!");
//     } catch (error) {
//       console.error("Error adding project:", error.message);
//     }
//   };
  


//   const dispatch = useDispatch();
//   // const navigate = useNavigate();
//   const { profile, role, loading, error } = useSelector((state) => state.form);

//     useEffect(() => {
//       dispatch(fetchUserProfile());
//     }, [dispatch]);
//     console.log("data",profile);
//     console.log(profile?.FullName);
//     console.log("role value",role)
//   // Only display the job post form if the user is an Employer
//   if (role !== 'Employer') {
//     return null; // Return nothing if role is not Employer
//   }


//   return (
    
//     <div className="max-w-full min-w-full mx-auto my-8 p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
//       <h2 className="text-2xl font-semibold text-center mb-6">Create Job Post</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="space-y-4">
//           <div className="flex items-center space-x-2">
//             <FaPen className="text-gray-500" />
//             <input
//               type="text"
//               id="jobTitle"
//               placeholder="Job Title"
//               className="p-3 border border-gray-300 rounded-md w-full"
//               name="jobTitle"
//               value={jobData.jobTitle}
//               onChange={(e) =>
//                 setJobData({
//                   ...jobData,
//                   jobTitle: e.target.value,
//                 })
//               }
//               required
//             />
//           </div>

//           <div className="flex items-center space-x-2">
//             <FaBuilding className="text-gray-500" />
//             <input
//               type="text"
//               id="companyName"
//               name="companyName"
//               value={jobData.companyName}
//               onChange={(e) =>
//                 setJobData({
//                   ...jobData,
//                   companyName: e.target.value,
//                 })
//               }
//               placeholder="Company Name"
//               className="p-3 border border-gray-300 rounded-md w-full"
//               required
//             />
//           </div>

//           <div className="flex items-center space-x-2">
//             <FaClipboard className="text-gray-500" />
//             <input
//               type="text"
//               id="sector"
//               name="sector"
//               value={jobData.sector}
//               onChange={(e) =>
//                 setJobData({
//                   ...jobData,
//                   sector: e.target.value,
//                 })
//               }
//               placeholder="Sector"
//               className="p-3 border border-gray-300 rounded-md w-full"
//               required
//             />
//           </div>

//           <div className="flex items-center space-x-2">
//             <FaClock className="text-gray-500" />
//             <input
//               type="text"
//               id="time"
//               name="time"
//               value={jobData.time}
//               onChange={(e) =>
//                 setJobData({
//                   ...jobData,
//                   time: e.target.value,
//                 })
//               }
//               placeholder="Job Time"
//               className="p-3 border border-gray-300 rounded-md w-full"
//               required
//             />
//           </div>

//           <div className="flex items-center space-x-2">
//             <FaDollarSign className="text-gray-500" />
//             <input
//               type="text"
//               id="salary"
//               name="salary"
//               value={jobData.salary}
//               onChange={(e) =>
//                 setJobData({
//                   ...jobData,
//                   salary: e.target.value,
//                 })
//               }
//               placeholder="Salary"
//               className="p-3 border border-gray-300 rounded-md w-full"
//               required
//             />
//           </div>

//           <div className="flex items-center space-x-2">
//             <FaMapMarkerAlt className="text-gray-500" />
//             <input
//               type="text"
//               id="location"
//               name="location"
//               value={jobData.location}
//               onChange={(e) =>
//                 setJobData({
//                   ...jobData,
//                   location: e.target.value,
//                 })
//               }
//               placeholder="Location"
//               className="p-3 border border-gray-300 rounded-md w-full"
//               required
//             />
//           </div>

//           <div className="flex flex-col space-y-2">
//             <label className="text-sm font-medium" htmlFor="jobDescription">Job Description</label>
//             <div className="flex items-center space-x-2">
//               <FaClipboard className="text-gray-500" />
//               <textarea
//                 id="jobDescription"
//                 name="jobDescription"
//                 value={jobData.jobDescription}
//                 onChange={(e) =>
//                   setJobData({
//                     ...jobData,
//                     jobDescription: e.target.value,
//                   })
//                 }
//                 placeholder="Job Description"
//                 className="p-3 border border-gray-300 rounded-md w-full"
//                 required
//               />
//             </div>
//           </div>

//           <div className="flex flex-col space-y-2">
//             <label className="text-sm font-medium" htmlFor="keyResponsibility">Key Responsibilities</label>
//             <div className="flex items-center space-x-2">
//               <FaTasks className="text-gray-500" />
//               <textarea
//                 id="keyResponsibility"
//                 name="keyResponsibility"
//                 value={jobData.keyResponsibility}
//                 onChange={(e) =>
//                   setJobData({
//                     ...jobData,
//                     keyResponsibility: e.target.value,
//                   })
//                 }
//                 placeholder="Key Responsibilities"
//                 className="p-3 border border-gray-300 rounded-md w-full"
//                 required
//               />
//             </div>
//           </div>

//           <div className="flex flex-col space-y-2">
//             <label className="text-sm font-medium" htmlFor="professionalSkills">Professional Skills</label>
//             <div className="flex items-center space-x-2">
//               {/* <FaSkills className="text-gray-500" /> */}
//               <textarea
//                 id="professionalSkills"
//                 name="professionalSkills"
//                 value={jobData.professionalSkills}
//                 onChange={(e) =>
//                   setJobData({
//                     ...jobData,
//                     professionalSkills: e.target.value,
//                   })
//                 }
//                 placeholder="Professional Skills"
//                 className="p-3 border border-gray-300 rounded-md w-full"
//                 required
//               />
//             </div>
//           </div>

//           <div className="mt-6 text-center">
//             <button
//               type="submit"
//               className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-300"
//             >
//               Create Job Post
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default JobPost;





import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaDollarSign,
  FaMapMarkerAlt,
  FaClipboard,
  FaTasks,
  FaClock,
  FaPen,
} from "react-icons/fa"; // Importing icons
import { SlBookOpen } from "react-icons/sl";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../Redux/features/PostServiceF";
import { Databases, Query, ID } from "appwrite";
import config from "../../appWrite/config";
import client from "../../appWrite/AppwriteConfigPost";
import { useNavigate } from "react-router-dom";

const JobPost = () => {
  // State for form inputs
  const [jobPosts, setJobPosts] = useState([]);
  const navigate =useNavigate()
  const [jobData, setJobData] = useState({
    jobTitle: "",
    companyName: "",
    sector: "",
    time: "",
    salary: "",
    experience:"",
    location: "",
    jobDescription: "",
    keyResponsibility: "",
    professionalSkills: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const databases = new Databases(client);

      // Create Job Post in Appwrite
      const projectResponse = await databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteJobPostId,
        ID.unique(),
        jobData
      );
      console.log("Job Post created successfully:", projectResponse);

      // Associate Job Post with Employer
      const email = localStorage.getItem("Token"); // Adjust this if needed
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
        location: "",
        jobDescription: "",
        keyResponsibility: "",
        professionalSkills: "",
      });
      navigate("/userhomepage")
    } catch (error) {
      console.error("Error creating job post:", error.message);
    }
  };


  //Delete Function
 
  

  // Only render form for Employers
  if (role !== "Employer") {
    return null;
  }

  return (
    <div className="max-w-full mx-auto my-8 p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
    <h2 className="text-2xl font-semibold text-center mb-6">Create Job Post</h2>
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Input Fields */}
        {[
          { id: "jobTitle", icon: FaPen, placeholder: "Job Title" },
          { id: "companyName", icon: FaBuilding, placeholder: "Company Name" },
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
            {["Full-Time", "Part-Time", "Night-Shift", "Day-Shift"].map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
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
          { id: "professionalSkills", label: "Professional Skills" },
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

