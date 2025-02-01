import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSingleUserProfile,
  fetchProjects,
} from "../../Redux/features/PostServiceF";
import config from "../../appWrite/config";
import ProfileComponent from "./profileComponent";

function ViewProfile() {
  const { candidateId } = useParams(); // Get the candidate ID from the URL
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const { selectedProfile, projects } = useSelector((state) => state.form); // Fetch candidate profile and projects from Redux
  const [selectedProject, setSelectedProject] = useState(null);
  console.log("viewPage projects", projects);
  useEffect(() => {
    dispatch(fetchSingleUserProfile(candidateId)); // Fetch candidate details
    dispatch(fetchProjects(candidateId)); // Fetch candidate projects
  }, [dispatch, candidateId]);

  console.log("viewProfile candidate", selectedProfile);
  return (
    <div className=" flex justify-center w-full mx-auto">
      <div className="componen  mt-10">
        <ProfileComponent />
      </div>

      <div className=" p-6 max-w-6xl space-y-8">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md p-6 gap-6">
          {/* Profile Image and Info */}
          <div className="flex flex-col items-center md:w-1/4 text-center bg-yellow-50 p-4 rounded-lg">
            <div className="rounded-full overflow-hidden bg-slate-400 w-36 h-36">
              <img
                src={
                  selectedProfile?.profileImage
                    ? `${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${selectedProfile.profileImage}/view?project=${config.appwriteProjectId}`
                    : "placeholder.jpg"
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
          <div className="md:w-3/4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <p className="text-gray-700">
              <span className="font-semibold">Job Status:</span>{" "}
              {selectedProfile?.JobStatus || "N/A"}
            </p>
          </div>
        </div>

        {/* Resume Display Section */}
        <div className="flex flex-col items-center mt-4">
          {selectedProfile?.resumeId ? (
            <a
              href={`${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${selectedProfile.resumeId}/view?project=${config.appwriteProjectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Download Resume
            </a>
          ) : (
            <p className="text-gray-500">Resume not uploaded yet.</p>
          )}
        </div>

        {/* Skills Section */}
        <div className="bg-yellow-100 rounded-lg p-6">
          <h2 className="text-lg font-bold text-center mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2 justify-center uppercase">
            {selectedProfile?.skills?.length > 0 ? (
              selectedProfile.skills.map((skill, ind) => (
                <span
                  key={ind}
                  className="bg-yellow-200 text-sm font-medium text-gray-800 rounded-full px-3 py-1"
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
        <div className="bg-yellow-100 rounded-lg p-6 mt-6">
          <h2 className="text-lg font-bold text-center mb-4">Certifications</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedProfile?.certifications?.length > 0 ? (
              selectedProfile.certifications.map((cert, ind) => (
                <span
                  key={ind}
                  className="bg-yellow-200 text-sm font-medium text-gray-800 rounded-full px-3 py-1"
                >
                  {cert}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No certifications listed.</p>
            )}
          </div>
        </div>

        {/* Portfolio Links Section */}
        <div className="bg-yellow-100 rounded-lg p-6 mt-6">
          <h2 className="text-lg font-bold text-center mb-4">
            Portfolio Links
          </h2>
          <ul className="list-disc list-inside">
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
          <div className="p-6 bg-gray-800 rounded-lg shadow-md mt-6 h-[500px] overflow-y-auto">
            {/* Project Title */}
            <h1 className="text-3xl font-bold uppercase">
              {selectedProject.title}
            </h1>

            {/* Project Thumbnail */}
            <img
              src={`${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${selectedProject?.thumbnail}/view?project=${config.appwriteProjectId}`}
              alt={selectedProject.title}
              className="w-full h-64 object-cover rounded-lg mt-4"
            />

            {/* Project Description */}
            <p className="text-lg mt-4 break-words">
              {selectedProject.description}
            </p>

            {/* Technologies Used */}
            <div className="mt-6">
              <h2 className="text-xl font-bold">Technologies Used:</h2>
              <p className="text-md mt-2 break-words">
                {selectedProject.technologies}
              </p>
            </div>

            {/* Gallery Section */}
            <div className="mt-6">
              <h2 className="text-xl font-bold">Gallery:</h2>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {selectedProject?.images?.map((imageId) => (
                  <img
                    key={imageId}
                    src={`${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${imageId}/view?project=${config.appwriteProjectId}`}
                    alt="Gallery Image"
                    className="w-full h-32 object-cover rounded cursor-pointer hover:shadow-lg transition"
                    onClick={() => setSelectedImage(imageId)} // Open image in modal
                  />
                ))}
              </div>
            </div>

            {/* Back to Projects Button */}
            <div className="mt-6 flex items-center gap-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={() => setSelectedProject(null)} // Close project details
              >
                Back to Projects
              </button>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative bg-white rounded-lg p-4 max-w-3xl w-full">
              {/* Enlarged Image */}
              <img
                src={`${config.appwriteUrl}/storage/buckets/${config.appwriteBucketId}/files/${selectedImage}/view?project=${config.appwriteProjectId}`}
                alt="Enlarged"
                className="w-full h-auto rounded-lg"
              />

              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 rounded-full p-2"
                onClick={() => setSelectedImage(null)} // Close modal
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ViewProfile;
