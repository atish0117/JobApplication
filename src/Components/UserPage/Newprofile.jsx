import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile,fetchProjects,addProject,deleteProject,fetchJobPosts,deleteJobPost } from "../../Redux/features/PostServiceF";
import { useNavigate } from "react-router-dom";
import { updateSelfNote } from "../../Redux/features/PostServiceF"; // Path to your updateSelfNote action
import { Databases, Query, Storage, Account, ID } from "appwrite";
import config from "../../appWrite/config";
import client from "../../appWrite/AppwriteConfigPost";
import { IoHomeOutline } from "react-icons/io5";
import {
  FaUser,
  FaBuilding,
  FaEnvelope,
  FaPhoneAlt,
  FaCogs,
  FaIndustry,
} from "react-icons/fa";
const Newprofile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, role,projects, jobPosts, status,loading, error } = useSelector((state) => state.form);
  console.log("check profilr data", profile);
  console.log("check project data", projects);
  console.log("check jobPosts data", jobPosts);
console.log(error)
  // State for Self Notes
  const [selfNote, setSelfNote] = useState(
    profile?.selfNote || "Write your notes here..."
  );
  const [isEditable, setIsEditable] = useState(false);

  const handleToggleEdit = () => {
    setIsEditable((prev) => !prev);
  };

  const handleSave = async () => {
    try {
      await dispatch(
        updateSelfNote({ userId: profile.$id, newSelfNote: selfNote })
      );
      console.log("userid from profile", userId);
      setIsEditable(false);
      alert("SelfNote updated successfully!");
    } catch (error) {
      console.error("Failed to update SelfNote:", error.message);
    }
  };

  // State for Projects
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // To show project details
  const [isOwner, setIsOwner] = useState(false); // Check if the logged-in user owns the profile
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: "",
    images: [],
    thumbnail: null,
  });




  const handleSendMessage = async (profile) => {
    try {
      const senderRole = role; // Current user's role
      const recipientEmail = profile.email; // Target user's email
      const senderName = profile.FullName || profile.orgName;

      const message =
        senderRole === "Employer"
          ? `Hello ${profile.FullName}, I am interested in your profile. Please check our job opportunities.`
          : `Hello ${profile.orgName}, I am interested in applying for a job. Please consider my profile.`;

      const response = await fetch("http://your-backend-endpoint/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmail,
          subject:
            senderRole === "Employer" ? "Job Interest" : "Job Application",
          message: message,
          sender: senderName,
        }),
      });

      if (response.ok) {
        alert("Message sent successfully!");
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const email = localStorage.getItem("Token");
        setIsOwner(profile?.email === email);
        
  useEffect(() => {
     dispatch(fetchUserProfile());
   
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleAdd = () => {
    
    dispatch(addProject(newProject));
  };

  const handleDelete = (id) => {
    dispatch(deleteProject(id));
  };
        // jobPost fetch
  useEffect(() => {
    
    if (profile?.jobPosts) {
      dispatch(fetchJobPosts(profile));
    }
  }, [profile, dispatch]);

        // delete jobpost 
  const handleDeletejobPost = (jobPostId) => {
    console.log("jobdeleted id",jobPostId)
    const email = localStorage.getItem("Token");
    dispatch(deleteJobPost({ jobPostId, email }));
  };

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {profile ? (
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
          <button
            onClick={() => handleSendMessage(profile)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {role === "Employer" ? "Contact " : "Apply for Job"}
          </button>
          {profile.role === "Employee" && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Employee's Info Page</h1>
                <div className="space-x-4">
                  <button className="px-4 py-2 bg-[#0e1822] hover:bg-[#ff4655]  rounded">
                    <IoHomeOutline className="text-2xl text-white"/>
                  </button>
                  <button className="px-4 py-2 bg-yellow-300 rounded">
                    Skills
                  </button>
                  <button className="px-4 py-2 bg-yellow-300 rounded">
                    Projects
                  </button>
                </div>
              </div>

              {/* Main Section */}
              <div className="grid grid-cols-6 gap-4">
                {/* Profile Section */}
                <div className="col-span-4 bg-gray-200 p-4 flex">
                  <div className="w-40 h-40 bg-gray-300 rounded-full mx-auto">
                    <img
                      src={profile?.profileImageUrl}
                      alt="Profile"
                      className="profile-image w-full h-full rounded-full"
                    />
                  </div>
                  <div className="details-part-1">
                    <p className="text-center mt-2">Name: {profile.FullName}</p>
                    <p className="text-center">Age:{profile.Age}</p>
                    <p className="text-center">Gender:{profile.Gender}</p>
                    <p className="text-center">Education: {profile.Education}</p>
                    <p className="text-center">Address: {profile.Address}</p>
                  </div>
                  <div className="border-2 rounded border-gray-400 mx-2"></div>
                  <div className="detail-part-2">
                    <p className="text-center mt-2">Contact: {profile.Contact}</p>
                    <p className="text-center">Email:{profile.email}</p>
                    <p className="text-center">Status: {profile.role}</p>
                    <p className="text-center">Address: {profile.Address}</p>
                  </div>
                </div>

                {/* Self Notes */}
                <div className="col-span-2 bg-gray-500 rounded-lg p-4 flex flex-wrap">
                  <div>
                    {isEditable ? (
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded "
                        value={selfNote}
                        onChange={(e) => setSelfNote(e.target.value)}
                      />
                    ) : (
                      <p className="selfnote-box">{profile.selfNote}</p>
                    )}
                  </div>
                  <button
                    onClick={handleToggleEdit}
                    className="toggle-edit-btn"
                  >
                    {isEditable ? "Cancel" : "Edit"}
                  </button>
                  {isEditable && (
                    <button
                      onClick={handleSave}
                      className="save-btn"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  )}
                </div>
              </div>

              {/* Skills Section */}
              <div className="bg-gray-200 rounded-lg p-4">
                <h2 className="text-lg font-bold">Skills with Experience</h2>
                {profile.skills.map((skill,inx)=>{
                  return(
                    <div key={inx} className=" my-4  flex flex-row w-full"> 
                          <span className="bg-gray-700  text-white px-2 py-3  rounded ms-9 text-xl" >
                          {skill}
                        </span>
                    </div>
                  )
                  })}
              </div>

             {/* Projects Section */}
<div className="bg-gray-200 rounded-lg p-4">
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-bold">Projects</h2>
    {isOwner && (
      <button
        className="px-4 py-2 bg-[#0e1822] hover:bg-[#ff4655] text-white rounded"
        onClick={() => {
          setShowForm(true);
          setSelectedProject(null);
        }}
      >
        Add Project
      </button>
    )}
  </div>

  {/* Project List */}
  <div className="grid grid-cols-4 gap-4 mt-4">
    {projects?.map((project) => (
      <div
        key={project.id}
        className="border border-gray-300 rounded-lg p-4 cursor-pointer"
        onClick={() => setSelectedProject(project)} // Open project details
      >
        <img
          src={
            project.thumbnail
              ? `${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${project.thumbnail}/view?project=${config.appwriteProjectId}`
              : "placeholder.jpg"
          }
          alt="Thumbnail"
          className="w-full h-32 object-cover rounded"
        />
        <h3 className="text-center font-bold mt-2">{project.title}</h3>
      </div>
    ))}
    {/* Add New Project Button */}
    {isOwner && (
      <div
        className="flex items-center justify-center border border-gray-300 rounded-lg h-32 cursor-pointer"
        onClick={() => {
          setShowForm(true);
          setSelectedProject(null);
        }}
      >
        <span className="text-2xl font-bold">+</span>
      </div>
    )}
  </div>
</div>

{/* Project Details Section */}
{selectedProject && (
  <div className="p-6 bg-white rounded-lg shadow-md mt-6">
    <h1 className="text-3xl font-bold">{selectedProject.title}</h1>
    <img
      src={`${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${selectedProject?.thumbnail}/view?project=${config.appwriteProjectId}`}
      alt={selectedProject.title}
      className="w-full h-64 object-cover rounded-lg mt-4"
    />
    <p className="text-lg mt-4">{selectedProject.description}</p>
    <div className="mt-6">
      <h2 className="text-xl font-bold">Technologies Used:</h2>
      <p className="text-md mt-2">{selectedProject.technologies}</p>
    </div>
    <div className="mt-6">
      <h2 className="text-xl font-bold">Gallery:</h2>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {selectedProject?.images?.map((imageId) => (
          <img
            key={imageId}
            src={`${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${imageId}/view?project=${config.appwriteProjectId}`}
            alt="Gallery Image"
            className="w-full h-32 object-cover rounded"
          />
        ))}
      </div>
    </div>
    <div className="mt-6 flex items-center gap-4">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setSelectedProject(null)} // Close project details
      >
        Back to Projects
      </button>
      {isOwner && (
        <button
          onClick={() => dispatch(deleteProject(selectedProject?.$id))}
          className="bg-red-600 text-white px-3 py-2 rounded"
        >
          Delete Project
        </button>
      )}
    </div>
  </div>
)}

{/* Add/Edit Project Form */}
{showForm && isOwner && (
  <div className="bg-white p-6 rounded-lg shadow-md mt-6">
    <h2 className="text-lg font-bold">
      {selectedProject ? "Edit Project" : "Add Project"}
    </h2>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (selectedProject) {
          // Handle Edit Logic Here
        } else {
          dispatch(addProject(newProject));
        }
        setShowForm(false);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block font-bold">Project Title</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={newProject.title}
          onChange={(e) =>
            setNewProject({
              ...newProject,
              title: e.target.value,
            })
          }
          required
        />
      </div>
      <div>
        <label className="block font-bold">Description</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({
              ...newProject,
              description: e.target.value,
            })
          }
          required
        ></textarea>
      </div>
      <div>
        <label className="block font-bold">Technologies</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          value={newProject.technologies}
          onChange={(e) =>
            setNewProject({
              ...newProject,
              technologies: e.target.value,
            })
          }
          required
        />
      </div>
      <div>
        <label className="block font-bold">Thumbnail</label>
        <input
          type="file"
          className="w-full p-2"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setNewProject({
              ...newProject,
              thumbnail: file,
            });
          }}
        />
      </div>
      <div>
        <label className="block font-bold">Images</label>
        <input
          type="file"
          multiple
          className="w-full p-2"
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files);
            setNewProject({
              ...newProject,
              images: files,
            });
          }}
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-[#0e1822] hover:bg-[#ff4655] text-white rounded"
        >
          Save Project
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

            </>
          )}
          {role === "Employer" && (
            <>
              <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="text-center">
                  <img
                    src={profile?.profileImageUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto mb-4"
                  />
                  <h2 className="text-3xl font-bold text-gray-800">
                    {profile.FullName}
                  </h2>
                  <p className="text-xl text-gray-600">
                    {profile.post} at {profile.orgName}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FaBuilding className="text-gray-500" />
                      <div>
                        <h3 className="font-medium text-gray-700">
                          Organization
                        </h3>
                        <p className="text-gray-600">{profile.orgName}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FaUser className="text-gray-500" />
                      <div>
                        <h3 className="font-medium text-gray-700">Full Name</h3>
                        <p className="text-gray-600">{profile.FullName}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FaEnvelope className="text-gray-500" />
                      <div>
                        <h3 className="font-medium text-gray-700">Email</h3>
                        <p className="text-gray-600">{profile.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FaPhoneAlt className="text-gray-500" />
                      <div>
                        <h3 className="font-medium text-gray-700">Contact</h3>
                        <p className="text-gray-600">{profile.Contact}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FaCogs className="text-gray-500" />
                      <div>
                        <h3 className="font-medium text-gray-700">Skills</h3>
                        <p className="text-gray-600">{profile.skills}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <FaIndustry className="text-gray-500" />
                      <div>
                        <h3 className="font-medium text-gray-700">Industry</h3>
                        <p className="text-gray-600">{profile.industry}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <div className="mt-6 text-center">
                  <button className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-300">
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="max-w-full min-w-full mx-auto my-8 p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold text-center mb-6 underline">JOBS POST</h2>

      {/* Conditional Rendering */}
      {jobPosts.length === 0 ? (
        <p className="text-center text-gray-500">No job posts found.</p>
      ) : (
        <div className="space-y-4">
          {/* Render Job Posts */}
          {jobPosts?.map((post) => (
            <div key={post.$id} className="p-4 border border-gray-300 rounded-md shadow-md">
              <h3 className="text-xl font-bold">{post.jobTitle}</h3>
              <p className="text-sm text-gray-600">
                <strong>Company:</strong> {post.companyName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Sector:</strong> {post.sector}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Location:</strong> {post.location}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Salary:</strong> {post.salary}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Job Description:</strong> {post.jobDescription}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Key Responsibilities:</strong> {post.keyResponsibility}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Professional Skills:</strong> {post.professionalSkills}
              </p>

              {/* Delete Button */}
              <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDeletejobPost(post.$id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
            </>
          )}
        </div>
      ) : (
        <p>No profile found.</p>
      )}
    </div>
  );
};

export default Newprofile;
