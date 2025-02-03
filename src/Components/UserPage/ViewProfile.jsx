import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoHomeOutline } from "react-icons/io5";
import {
  fetchSingleUserProfile,
  fetchProjects,
  fetchCertificates,
} from "../../Redux/features/PostServiceF";
import config from "../../appWrite/config";
import ProfileComponent from "./ProfileComponent";

function ViewProfile() {
  const { candidateId } = useParams(); // Get the candidate ID from the URL
  const dispatch = useDispatch();
  const { selectedProfile, projects, certificates } = useSelector((state) => state.form); // Fetch candidate profile and projects from Redux
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    dispatch(fetchSingleUserProfile(candidateId)).then(() => {
      dispatch(fetchCertificates(candidateId)); // Fetch certificates after profile is loaded
    });
    dispatch(fetchProjects(candidateId)); // Fetch candidate projects
  }, [dispatch, candidateId]);

  return (
    <div className="flex flex-col lg:flex-row justify-center w-full mx-auto p-4 bg-gray-50">
      {/* Left Sidebar */}
      <div className="lg:w-1/4 lg:pr-4 mb-6 lg:mb-0">
        <ProfileComponent />
      </div>

      {/* Main Content */}
      <div className="lg:w-3/4 space-y-8">
        {/* Home Button */}
        <div className="flex justify-end">
          <Link
            to="/userhomepage"
            className="p-2 bg-[#0e1822] hover:bg-[#ff4655] rounded-full transition"
          >
            <IoHomeOutline className="text-xl text-white" />
          </Link>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center md:w-1/3 text-center">
              <div className="rounded-full overflow-hidden bg-gray-200 w-36 h-36">
                <img
                  src={
                    selectedProfile?.profileImage
                      ? `${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${selectedProfile.profileImage}/view?project=${config.appwriteProjectId}`
                      : "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold mt-4 uppercase">
                {selectedProfile?.FullName || "Name"}
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                {selectedProfile?.email || "Email"}
              </p>
            </div>

            {/* Profile Details */}
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <span className="font-semibold">Gender:</span>{" "}
                {selectedProfile?.Gender || "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Age:</span>{" "}
                {selectedProfile?.Age || "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Education:</span>{" "}
                {selectedProfile?.Education || "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Contact:</span>{" "}
                {selectedProfile?.Contact || "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">College:</span>{" "}
                {selectedProfile?.college || "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Address:</span>{" "}
                {selectedProfile?.Address || "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Job Status:</span>{" "}
                {selectedProfile?.JobStatus || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Resume</h2>
          {selectedProfile?.resume ? (
            <a
              href={`${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${selectedProfile.resume}/view?project=${config.appwriteProjectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              View Resume
            </a>
          ) : (
            <p className="text-gray-500">Resume not uploaded yet.</p>
          )}
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {selectedProfile?.skills?.length > 0 ? (
              selectedProfile.skills.map((skill, ind) => (
                <span
                  key={ind}
                  className="bg-blue-100 text-sm font-medium text-blue-800 rounded-full px-3 py-1"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills listed.</p>
            )}
          </div>
        </div>

        {/* Certifications Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates?.length > 0 ? (
              certificates.map((certificate, ind) => (
                <div
                  key={ind}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold mb-2">{certificate.title}</h3>
                  <img
                    src={`${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${certificate?.fileId}/view?project=${config.appwriteProjectId}`}
                    alt={certificate.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No certifications listed.</p>
            )}
          </div>
        </div>

        {/* Portfolio Links Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Portfolio Links</h2>
          <ul className="space-y-2">
            {selectedProfile?.portfolioLinks?.length > 0 ? (
              selectedProfile.portfolioLinks.map((link, ind) => (
                <li key={ind}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No portfolio links listed.</p>
            )}
          </ul>
        </div>

        {/* Projects Section */}
          <div className="bg-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-bold">Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {projects?.map((project) => (
              <div
                key={project?.$id}
                className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-md transition"
                onClick={() => setSelectedProject(project)} // Open project details
              >
                <img
                  src={
                    project?.thumbnail
                      ? `${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${project.thumbnail}/view?project=${config.appwriteProjectId}`
                      : "placeholder.jpg"
                  }
                  alt="Thumbnail"
                  className="w-full h-32 object-cover rounded"
                />
                <h3 className="text-center font-bold mt-2 uppercase">
                  {project.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

   {/* Project Details Section */}
{selectedProject && (
  <div className="p-6 bg-gray-800 max-w-5xl rounded-lg shadow-2xl mt-6 mx-auto h-[500px] overflow-y-auto transform transition-all duration-300">
    {/* Project Title */}
    <h1 className="text-3xl font-bold uppercase text-white mb-4">
      {selectedProject.title}
    </h1>

    {/* Project Thumbnail */}
    <img
      src={`${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${selectedProject?.thumbnail}/view?project=${config.appwriteProjectId}`}
      alt={selectedProject.title}
      className="w-full h-64 object-cover rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
    />

    {/* Project Description */}
    <p className="text-lg mt-4 text-gray-300 break-words">
      {selectedProject.description}
    </p>

    {/* Technologies Used */}
    <div className="mt-6">
      <h2 className="text-xl font-bold text-white">Technologies Used:</h2>
      <p className="text-md mt-2 text-gray-300 break-words">
        {selectedProject.technologies}
      </p>
    </div>

    {/* Gallery Section */}
    <div className="mt-6">
      <h2 className="text-xl font-bold text-white">Gallery:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {selectedProject?.images?.map((imageId) => (
          <img
            key={imageId}
            src={`${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${imageId}/view?project=${config.appwriteProjectId}`}
            alt="Gallery Image"
            className="w-full h-32 object-cover rounded-lg shadow-md cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            onClick={() => setSelectedImage(imageId)} // Open image in modal
          />
        ))}
      </div>
    </div>

    {/* Back to Projects Button */}
    <div className="mt-6 flex items-center gap-4">
      <button
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
        onClick={() => setSelectedProject(null)} // Close project details
      >
        Back to Projects
      </button>
    </div>
  </div>
)}

{/* Image Modal */}
{selectedImage && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
    <div className="relative bg-gray-900 rounded-lg p-6 max-w-3xl w-full mx-4">
      {/* Enlarged Image */}
      <img
        src={`${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${selectedImage}/view?project=${config.appwriteProjectId}`}
        alt="Enlarged"
        className="w-full h-auto max-h-dvh rounded-lg shadow-2xl"
      />

      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 rounded-full p-2 shadow-md transform transition-transform hover:scale-110"
        onClick={() => setSelectedImage(null)} // Close modal
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default ViewProfile;