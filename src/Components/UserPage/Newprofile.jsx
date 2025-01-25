import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  fetchProjects,
  addProject,
  deleteProject,
  fetchJobPosts,
  deleteJobPost,
} from "../../Redux/features/PostServiceF";
import { useNavigate } from "react-router-dom";
import { updateSelfNote } from "../../Redux/features/PostServiceF"; // Path to your updateSelfNote action
import config from "../../appWrite/config";
import client from "../../appWrite/AppwriteConfigPost";
import { Databases, Storage, ID } from "appwrite";
import { IoHomeOutline } from "react-icons/io5";
import {
  FaUser,
  FaBuilding,
  FaEnvelope,
  FaPhoneAlt,
  FaCogs,
  FaIndustry,
  FaHome,
  FaFileDownload,
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaEdit,
} from "react-icons/fa";
const Newprofile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, role, projects, jobPosts, status, loading, error } =
    useSelector((state) => state.form);
  console.log("check profilr data", profile);
  console.log("check project data", projects);
  console.log("check jobPosts data", jobPosts);
  console.log(error);

  // Move email check into useEffect
  useEffect(() => {
    const email = localStorage.getItem("Token");
    if (profile?.email && email) {
      setIsOwner(profile.email === email);
    }
  }, [profile?.email]);

  const handleToggleEdit = () => {
    setIsEditable((prev) => !prev);
  };

  // State for Self Notes
  const [selfNote, setSelfNote] = useState(
    profile?.selfNote || "Write your notes here..."
  );
  const [isEditable, setIsEditable] = useState(false);

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

  // state for social media kink resume
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    github: "",
    // X: null
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(""); // To store the download URL after upload
  const [isEditing, setIsEditing] = useState(false); // Toggle for showing/hiding the form
  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
  };
  const updateUserProfile = async () => {
    try {
      const storage = new Storage(client);
      const databases = new Databases(client);

      let resumeUploadResponse = null;

      // Upload the resume to Appwrite Storage if a new file is selected
      if (resumeFile) {
        resumeUploadResponse = await storage.createFile(
          config.appwriteBucketId,
          ID.unique(),
          resumeFile
        );
        setResumeUrl(resumeUploadResponse.$id); // Save the resume file ID
      }
      // Construct updated profile data
      const updatedProfileData = {
        linkedin: socialLinks.linkedin,
        github: socialLinks.github,
        // X: socialLinks.X,
        resume: resumeUploadResponse ? resumeUploadResponse.$id : resumeUrl, // Use the new file ID if uploaded
      };
      // Update the user profile in Appwrite Database
      const response = await databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionIdJobaryProfileId,
        profile.$id, // Replace with actual user profile document ID
        updatedProfileData
      );
      console.log("Profile updated successfully:", response);
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile();
    setIsEditing(false); // Close the form after saving
  };

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
  // Update selfNote when profile changes
  useEffect(() => {
    if (profile?.selfNote) {
      setSelfNote(profile.selfNote);
    }
  }, [profile?.selfNote]);

  const handleSave = async () => {
    try {
      if (!profile?.$id) return;

      await dispatch(
        updateSelfNote({
          userId: profile.$id,
          newSelfNote: selfNote,
        })
      );
      setIsEditable(false);
    } catch (error) {
      console.error("Failed to update SelfNote:", error.message);
    }
  };

  // Combine related fetches into a single useEffect
  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchProjects());
  }, [dispatch]);

  // Separate useEffect for jobPosts with proper dependency
  useEffect(() => {
    if (profile?.jobPosts?.length > 0) {
      dispatch(fetchJobPosts(profile));
    }
  }, [dispatch, profile?.jobPosts]);

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
  }, [dispatch]);

  // delete jobpost
  const handleDeleteJobPost = useCallback(
    (jobPostId) => {
      const email = localStorage.getItem("Token");
      if (email) {
        dispatch(deleteJobPost({ jobPostId, email }));
      }
    },
    [dispatch]
  );

  // Loading and error states
  if (status === "loading") return <p>Loading...</p>;
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
                    <IoHomeOutline className="text-2xl text-white" />
                  </button>
                  <button className="px-4 py-2 bg-yellow-300 rounded">
                    Skills
                  </button>
                  <button className=" bg-yellow-300 rounded">
                    <div className="relative max-w-lg mx-auto p-4 border border-gray-200 rounded-lg shadow-lg bg-white">
                      <h2 className="text-sm font-semibold text-center">
                        SocialLink
                      </h2>

                      {/* Edit Button */}
                      <button
                        className="absolute right-0 bottom-0 p-1 text-black rounded-full   hover:text-yellow-300"
                        onClick={() => setIsEditing(true)} // Show the modal form on click
                      >
                        <FaEdit size={18} />
                      </button>

                      {/* Modal Form */}
                      {isEditing && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
                            <h3 className="text-2xl font-semibold text-center mb-4">
                              Edit Profile
                            </h3>

                            <form onSubmit={handleSubmit}>
                              {/* Social Media Links Section */}
                              <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                  <FaLinkedin className="text-blue-600" />
                                  <input
                                    type="url"
                                    name="linkedin"
                                    value={socialLinks.linkedin}
                                    onChange={handleSocialLinkChange}
                                    placeholder="LinkedIn URL"
                                    className="p-3 border border-gray-300 rounded-md w-full"
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <FaGithub className="text-gray-900" />
                                  <input
                                    type="url"
                                    name="github"
                                    value={socialLinks.github}
                                    onChange={handleSocialLinkChange}
                                    placeholder="GitHub URL"
                                    className="p-3 border border-gray-300 rounded-md w-full"
                                  />
                                </div>
                                {/* <div className="flex items-center space-x-2">
                  <FaTwitter className="text-blue-400" />
                  <input
                    type="url"
                    name="X"
                    value={socialLinks.X}
                    onChange={handleSocialLinkChange}
                    placeholder="Twitter URL"
                    className="p-3 border border-gray-300 rounded-md w-full"
                  />
                                </div> */}
                              </div>

                              {/* Resume Upload Section */}
                              <div className="space-y-4 mt-6">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="file"
                                    onChange={handleResumeUpload}
                                    className="p-3 border border-gray-300 rounded-md w-full"
                                    accept=".pdf,.jpg,.png,.doc,.docx"
                                  />
                                  {resumeFile && (
                                    <button
                                      type="button"
                                      className="bg-green-500 text-white p-2 rounded-md"
                                      onClick={() => {
                                        const downloadLink = `${config.appwriteEndpoint}/storage/buckets/${config.appwriteBucketId}/files/${resumeUrl}/download`;
                                        window.open(downloadLink, "_blank");
                                      }}
                                    >
                                      <FaFileDownload className="inline-block mr-2" />{" "}
                                      Download Resume
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Submit and Cancel Buttons */}
                              <div className="mt-6 flex justify-end space-x-4">
                                <button
                                  type="button"
                                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                                  onClick={() => setIsEditing(false)} // Close the modal without saving
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                  Save Profile
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
              {/* Main Section */}
              <div className="grid grid-cols-7 gap-4">
                {/* Profile Section */}
                <div className="col-span-4 bg-gray-200 p-4 flex relative">
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
                    <p className="text-center">
                      Education: {profile.Education}
                    </p>
                    <p className="text-center">Address: {profile.Address}</p>
                  </div>
                  <div className="border-2 rounded border-gray-400 mx-2"></div>
                  <div className="detail-part-2">
                    <p className="text-center mt-2">
                      Contact: {profile.Contact}
                    </p>
                    <p className="text-center">Email:{profile.email}</p>
                    <p className="text-center">Status: {profile.role}</p>
                    <p className="text-center">Address: {profile.Address}</p>
                  </div>
                </div>

                {/* Self Notes */}
                <div className="col-span-3 bg-gray-300 rounded-lg p-4 flex flex-wrap">
                  <div className="break-words">
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
                {profile.skills.map((skill, inx) => {
                  return (
                    <div key={inx} className=" my-4  flex flex-row w-full">
                      <span className="bg-gray-700  text-white px-2 py-3  rounded ms-9 text-xl">
                        {skill}
                      </span>
                    </div>
                  );
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
                      <h3 className="text-center font-bold mt-2">
                        {project.title}
                      </h3>
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
                  <h1 className="text-3xl font-bold">
                    {selectedProject.title}
                  </h1>
                  <img
                    src={`${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${selectedProject?.thumbnail}/view?project=${config.appwriteProjectId}`}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover rounded-lg mt-4"
                  />
                  <p className="text-lg mt-4">{selectedProject.description}</p>
                  <div className="mt-6">
                    <h2 className="text-xl font-bold">Technologies Used:</h2>
                    <p className="text-md mt-2">
                      {selectedProject.technologies}
                    </p>
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
                        onClick={() =>
                          dispatch(deleteProject(selectedProject?.$id))
                        }
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
                {/* Navbar with Home Icon */}
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Employer Profile
                  </h1>
                  <button
                    onClick={() => navigate("/home")} // Replace with the actual navigation method
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                  >
                    <FaHome className="text-gray-700 text-2xl" />
                  </button>
                </div>

                {/* Profile Section */}
                <div className="text-center">
                  <img
                    src={profile?.profileImageUrl || "/default-profile.png"} // Fallback image
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

                {/* Details Section */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Reusable Detail Component */}
                  {[
                    {
                      label: "Organization",
                      icon: FaBuilding,
                      value: profile.orgName,
                    },
                    {
                      label: "Full Name",
                      icon: FaUser,
                      value: profile.FullName,
                    },
                    { label: "Email", icon: FaEnvelope, value: profile.email },
                    {
                      label: "Contact",
                      icon: FaPhoneAlt,
                      value: profile.Contact,
                    },
                    { label: "Skills", icon: FaCogs, value: profile.skills },
                    {
                      label: "Industry",
                      icon: FaIndustry,
                      value: profile.industry,
                    },
                  ].map(({ label, icon: Icon, value }, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <Icon className="text-gray-500 text-xl mt-1" />
                      <div>
                        <h3 className="font-medium text-gray-700">{label}</h3>
                        <p className="text-gray-600">{value || "N/A"}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Profile Button */}
                <div className="mt-6 text-center">
                  <button className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-300">
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Job Posts Section */}
              <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-center mb-6 underline">
                  Job Posts
                </h2>

                {/* Conditional Rendering */}
                {jobPosts.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No job posts found.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Render Job Posts */}
                    {jobPosts.map((post) => (
                      <div
                        key={post.$id}
                        className="p-4 bg-gray-50 border border-gray-300 rounded-md shadow-md hover:shadow-lg transition"
                      >
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
                          <strong>Description:</strong> {post.jobDescription}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Responsibilities:</strong>{" "}
                          {post.keyResponsibility}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Skills:</strong> {post.professionalSkills}
                        </p>

                        {/* Delete Button */}
                        <button
                          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => handleDeleteJobPost(post.$id)}
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
