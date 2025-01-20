import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../Redux/features/PostServiceF";
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
  const { profile, role, loading, error } = useSelector((state) => state.form);
  console.log("check profilr data", profile);

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
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // To show project details
  const [isOwner, setIsOwner] = useState(false); // Check if the logged-in user owns the profile
  const [jobPosts, setJobPosts] = useState([]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: "",
    images: [],
    thumbnail: null,
  });

  // Handle project form submission
  const handleAddProject = async (e) => {
    e.preventDefault();

    try {
      const databases = new Databases(client);
      const storage = new Storage(client);

      // Upload thumbnail if provided
      let thumbnailFile = null;
      if (newProject.thumbnail) {
        thumbnailFile = await storage.createFile(
          config.appwriteBucketId,
          ID.unique(),
          newProject.thumbnail
        );
      }

      // Upload additional images if provided
      const imageFiles = newProject.images.length
        ? await Promise.all(
            newProject.images.map(async (image) => {
              const uploadedFile = await storage.createFile(
                config.appwriteBucketId,
                ID.unique(),
                image
              );
              return uploadedFile.$id; // Store file IDs
            })
          )
        : [];

      // Create project in the Project Collection
      const projectResponse = await databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteUserProjectId,
        ID.unique(),
        {
          title: newProject.title,
          description: newProject.description,
          technologies: newProject.technologies,
          thumbnail: thumbnailFile ? thumbnailFile.$id : null,
          images: imageFiles,
        }
      );
      console.log("Project created successfully:", projectResponse);
      const email = localStorage.getItem("Token"); // Adjust if needed
      const userResponse = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionIdJobaryProfileId,
        [Query.equal("email", email)]
      );

      if (userResponse.documents.length > 0) {
        const userId = userResponse.documents[0].$id;

        // Add the new project ID to the user's `projects` key
        const updatedProjects = [
          ...(userResponse.documents[0].projects || []),
          projectResponse.$id,
        ];

        await databases.updateDocument(
          config.appwriteDatabaseId,
          config.appwriteCollectionIdJobaryProfileId,
          userId,
          { projects: updatedProjects }
        );
      }

      // Update local state and reset form
      setProjects([...projects, { ...newProject, id: projectResponse.$id }]);
      setShowForm(false);
      setNewProject({
        title: "",
        description: "",
        technologies: "",
        images: [],
        thumbnail: null,
      });

      console.log("Project added successfully!");
    } catch (error) {
      console.error("Error adding project:", error.message);
    }
  };

  // fetch project in user's profile page
  const fetchProjects = async () => {
    try {
      const databases = new Databases(client);
      const projectIds = profile?.projects || [];
      console.log("Fetching projects with IDs:", projectIds);

      const projectDetails = await Promise.all(
        projectIds.map((projectId) =>
          databases.getDocument(
            config.appwriteDatabaseId,
            config.appwriteUserProjectId,
            projectId
          )
        )
      );

      setProjects(
        projectDetails.map((project) => ({
          ...project,
          thumbnail: project.thumbnail || null,
          images: project.images || [],
        }))
      );
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  };

  //Delete Project Function
  const deleteProject = async (projectI) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
  if (!confirmDelete) return;
    try {
      const databases = new Databases(client);
      const storage = new Storage(client);


      // Fetch project details to identify files to delete
      const project = await databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteUserProjectId,
        projectI
      );

      // Delete the thumbnail if it exists
      if (project.thumbnail) {
        await storage.deleteFile(config.appwriteBucketId, project.thumbnail);
      }

      // Delete additional images if they exist
      if (project.images && project.images.length > 0) {
        await Promise.all(
          project.images.map((imageId) =>
            storage.deleteFile(config.appwriteBucketId, imageId)
          )
        );
      }

      // Delete the project document
      await databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteUserProjectId,
        projectI
      );
      const email = localStorage.getItem("Token"); // Adjust if needed
      // Remove the project ID from the user's `projects` key
      const userResponse = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionIdJobaryProfileId,
        [Query.equal("email", email)]
      );

      if (userResponse.documents.length > 0) {
        const userId = userResponse.documents[0].$id;

        const updatedProjects = userResponse.documents[0].projects.filter(
          (id) => id !== projectI
        );

        await databases.updateDocument(
          config.appwriteDatabaseId,
          config.appwriteCollectionIdJobaryProfileId,
          userId,
          { projects: updatedProjects }
        );
      }

      // Update local state to remove the project
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.$id !== projectI)
      );

      console.log("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error.message);
    }
  };

  // fetch JOBPOST in employer profile
  const fetchJobPosts = async () => {
    try {
      const databases = new Databases(client);
      const jobPostIds = profile?.jobPosts || [];

      const jobPostsDetails = await Promise.all(
        jobPostIds.map((jobPostId) =>
          databases.getDocument(
            config.appwriteDatabaseId,
            config.appwriteJobPostId,
            jobPostId
          )
        )
      );
      console.log("jobpost details", jobPostsDetails);
      setJobPosts(jobPostsDetails);
    } catch (err) {
      console.error("Error fetching job posts:", err.message);
      setError(err.message);
    }
  };

  // detele jobpost function
  const handleDelete = async (jobPostId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job post?"
    );
    if (!confirmDelete) return;

    try {
      const databases = new Databases(client);

      // Delete the Job Post document
      await databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteJobPostId,
        jobPostId
      );
      console.log(`Job Post ${jobPostId} deleted successfully.`);

      // Fetch the employer profile
      const email = localStorage.getItem("Token"); // Adjust if needed
      const userResponse = await databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionIdEmployerProfileId,
        [Query.equal("email", email)]
      );

      if (userResponse.documents.length > 0) {
        const userId = userResponse.documents[0].$id;

        // Update the jobPosts array in the employer profile
        const updatedJobPosts = (
          userResponse.documents[0].jobPosts || []
        ).filter((postId) => postId !== jobPostId);

        await databases.updateDocument(
          config.appwriteDatabaseId,
          config.appwriteCollectionIdEmployerProfileId,
          userId,
          { jobPosts: updatedJobPosts }
        );

        console.log("Job Post removed from user profile successfully!");
      } else {
        console.error("Employer profile not found for the given email.");
      }

      // Update local state
      setJobPosts(jobPosts.filter((post) => post.id !== jobPostId));
    } catch (error) {
      console.error("Error deleting job post:", error.message);
    }
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

  useEffect(() => {
    const initialize = async () => {
      try {
        const profileData = await dispatch(fetchUserProfile()).unwrap();
        if (profileData.profile.projects?.length > 0) {
          await fetchProjects(); // Fetch projects only if there are project IDs
        } else if (profileData.profile.jobPosts?.length > 0) {
          await fetchJobPosts(); // Fetch jobpost only if there are jobpopst IDs
        }

        // Check if the logged-in user is viewing their own profile
        const email = localStorage.getItem("Token");
        setIsOwner(profileData.profile.email === email);
      } catch (error) {
        console.error("Error initializing:", error.message);
      }
    };
    initialize();
  }, [dispatch]);

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
                      onClick={() =>
                        setShowForm(true) || setSelectedProject(null)
                      }
                    >
                      Add Project
                    </button>
                  )}
                </div>
                {/* Project List */}
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {projects?.map((project, index) => (
                    <div
                      key={index}
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
                  <div
                    className="flex items-center justify-center border border-gray-300 rounded-lg h-32 cursor-pointer"
                    onClick={() => setShowForm(true)}
                  >
                    <span className="text-2xl font-bold">+</span>
                  </div>
                </div>
              </div>

              {/* Project Details Section */}

              {/* {projects?.map((project, index) => ( */}
              {selectedProject && (
                <div className="p-6">
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

                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => setSelectedProject(null)} // Close project details
                  >
                    Back to Projects
                  </button>

                  <button
                    onClick={() => deleteProject(selectedProject?.$id)}
                    className="bg-red-600 text-white px-3 py-2 rounded"
                  >
                    Delete Project
                  </button>
                </div>
                // ))}
              )}

              {/* Add Project Form */}
              {showForm && isOwner && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-bold">Add Project</h2>
                  <form onSubmit={handleAddProject} className="space-y-4">
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
                        required
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
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0e1822] hover:bg-[#ff4655] text-white rounded"
                    >
                      Save Project
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-500 text-white rounded ml-4"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
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
                <h2 className="text-2xl font-semibold text-center mb-6 underline">
                  JOBS POST
                </h2>
                {loading ? (
                  <p className="text-center text-gray-500">
                    Loading job posts...
                  </p>
                ) : error ? (
                  <p className="text-center text-red-500">{error}</p>
                ) : jobPosts.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No job posts found.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {jobPosts.map((post) => (
                      <div
                        key={post.$id}
                        className="p-4 border border-gray-300 rounded-md shadow-md"
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
                          <strong>Job Description:</strong>{" "}
                          {post.jobDescription}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Key Responsibilities:</strong>{" "}
                          {post.keyResponsibility}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Professional Skills:</strong>{" "}
                          {post.professionalSkills}
                        </p>

                        <span>
                          <button
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => handleDelete(post.$id)}
                          >
                            Delete
                          </button>
                        </span>
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
