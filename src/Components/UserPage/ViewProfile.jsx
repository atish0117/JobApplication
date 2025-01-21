import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, fetchProjects } from "../../Redux/features/PostServiceF";
import config from "../../appWrite/config";

function ViewProfile() {
  const { candidateId } = useParams(); // Get the candidate ID from the URL
  const dispatch = useDispatch();

  const { profile, projects } = useSelector((state) => state.form); // Fetch candidate profile and projects from Redux
  const [selectedProject, setSelectedProject] = useState(null);
 console.log("viewPage projects",projects)
  useEffect(() => {
    dispatch(fetchUserProfile(candidateId)); // Fetch candidate details
    dispatch(fetchProjects(candidateId)); // Fetch candidate projects
  }, [dispatch, candidateId]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold">{profile?.FullName}'s Profile</h1>
      <p className="text-lg mt-4">
        <strong>Email:</strong> {profile?.email}
      </p>
      <p className="text-lg">
        {/* <strong>Skills:</strong> {profile?.skills?.join(", ") || "N/A"} */}
      </p>
      <p className="text-lg">
        <strong>Experience:</strong> {profile?.experience || "N/A"}
      </p>

      {/* Projects Section */}
      <div className="bg-gray-200 rounded-lg p-4 mt-6">
        <h2 className="text-lg font-bold">Projects</h2>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {projects?.map((project) => (
            <div
              key={project?.$id}
              className="border border-gray-300 rounded-lg p-4 cursor-pointer"
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
              <h3 className="text-center font-bold mt-2">{project.title}</h3>
            </div>
          ))}
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
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewProfile;
