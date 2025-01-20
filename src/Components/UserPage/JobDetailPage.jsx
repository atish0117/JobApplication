import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Databases} from "appwrite";
import config from "../../appWrite/config";
import client from "../../appWrite/AppwriteConfigPost";

const JobDetailPage = () => {
  const { jobId } = useParams(); // Get the job ID from the URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch job data from Appwrite if not passed through state
    const fetchJobDetails = async () => {
      try {
      const databases = new Databases(client);

        const response = await databases.getDocument(
          config.appwriteDatabaseId, // Replace with your Appwrite database ID
          config.appwriteJobPostId, // Replace with your Appwrite jobpost ID
          jobId
        );
        setJob(response);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job details not found!</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">{job.jobTitle}</h1>
      <p className="text-lg mb-2"><strong>Company:</strong> {job.companyName}</p>
      <p className="text-lg mb-2"><strong>Location:</strong> {job.location}</p>
      <p className="text-lg mb-2"><strong>Salary:</strong> {job.salary}</p>
      <p className="text-lg mb-2"><strong>Time:</strong> {job.time}</p>
      <p className="text-lg mb-4"><strong>Sector:</strong> {job.sector}</p>
      <h2 className="text-xl font-bold mb-2">Job Description</h2>
      <p className="mb-4">{job.jobDescription}</p>
      <h2 className="text-xl font-bold mb-2">Key Responsibilities</h2>
      <p className="mb-4">{job.keyResponsibility}</p>
      <h2 className="text-xl font-bold mb-2">Professional Skills</h2>
      <p>{job.professionalSkills}</p>
    </div>
  );
};

export default JobDetailPage;
