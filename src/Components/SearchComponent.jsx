import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../Redux/features/PostServiceF";
import { Databases } from "appwrite";
import config from "../appWrite/config"; // Add your Appwrite config here
import client from "../appWrite/AppwriteConfigPost";

const SearchComponent = () => {
  const dispatch = useDispatch();
  const { role, loading, error } = useSelector((state) => state.form);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [searchParams, setSearchParams] = useState({
    title: "",
    location: "",
    company: "",
    jobType: "",
    experience: "",
    salary: "",
    skills: "",
  });

  useEffect(() => {
    dispatch(fetchUserProfile()).then(() => {
      if (role === "Employee") {
        fetchJobs();
      } else if (role === "Employer") {
        fetchCandidates();
      }
    });
  }, [dispatch, role]);

  const fetchJobs = async () => {
    try {
      const databases = new Databases(client);
      const response = await databases.listDocuments(
        config.appwriteDatabaseId, // Replace with your database ID
        config.appwriteJobPostId // Replace with your collection ID
      );
      console.log("search job",response.documents)
      setJobs(response.documents);
      setResults(response.documents);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const databases = new Databases();
      const response = await databases.listDocuments(
        config.appwriteDatabaseId, // Replace with your database ID
        config.appwriteCandidateCollectionId // Replace with your collection ID
      );
      setCandidates(response.documents);
      setResults(response.documents);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const handleSearch = () => {
    if (role === "Employee") {
      const filteredJobs = jobs.filter((job) => {
        console.log("jobs",job)
        return (
          (searchParams.title
            ? job?.jobTitle?.toLowerCase().includes(searchParams.title.toLowerCase())
            : true) &&
          (searchParams.location
            ? job?.location?.toLowerCase().includes(searchParams.location.toLowerCase())
            : true) &&
          (searchParams.company
            ? job?.companyName?.toLowerCase().includes(searchParams.company.toLowerCase())
            : true) &&
          (searchParams.jobType ? job?.time === searchParams.jobType : true) &&
          (searchParams.experience ? job?.experience === searchParams.experience : true) &&
          (searchParams.salary ? job?.salary >= parseInt(searchParams.salary, 10) : true)
        );
      });
      setResults(filteredJobs);
    } else if (role === "Employer") {
      const filteredCandidates = candidates.filter((candidate) => {
        return (
          (searchParams.skills
            ? candidate?.skills?.toLowerCase().includes(searchParams.skills.toLowerCase())
            : true) &&
          (searchParams.location
            ? candidate?.location?.toLowerCase().includes(searchParams.location.toLowerCase())
            : true)
        );
      });
      setResults(filteredCandidates);
    }
  };
  

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">
        {role === "Employee" ? "Search Jobs" : "Search Candidates"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {role === "Employee" && (
          <>
            <input
              type="text"
              placeholder="Job Title"
              className="p-2 border rounded"
              value={searchParams.title}
              onChange={(e) =>
                setSearchParams({ ...searchParams, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Location"
              className="p-2 border rounded"
              value={searchParams.location}
              onChange={(e) =>
                setSearchParams({ ...searchParams, location: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Company"
              className="p-2 border rounded"
              value={searchParams.company}
              onChange={(e) =>
                setSearchParams({ ...searchParams, company: e.target.value })
              }
            />
            <select
              className="p-2 border rounded"
              value={searchParams.jobType}
              onChange={(e) =>
                setSearchParams({ ...searchParams, jobType: e.target.value })
              }
            >
              <option value="">Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Remote">Remote</option>
            </select>
            <select
              className="p-2 border rounded"
              value={searchParams.experience}
              onChange={(e) =>
                setSearchParams({ ...searchParams, experience: e.target.value })
              }
            >
              <option value="">Experience Level</option>
              <option value="Entry">Entry</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
            <input
              type="number"
              placeholder="Min Salary"
              className="p-2 border rounded"
              value={searchParams.salary}
              onChange={(e) =>
                setSearchParams({ ...searchParams, salary: e.target.value })
              }
            />
          </>
        )}
        {role === "Employer" && (
          <>
            <input
              type="text"
              placeholder="Skills (e.g., React, Python)"
              className="p-2 border rounded"
              value={searchParams.skills}
              onChange={(e) =>
                setSearchParams({ ...searchParams, skills: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Location"
              className="p-2 border rounded"
              value={searchParams.location}
              onChange={(e) =>
                setSearchParams({ ...searchParams, location: e.target.value })
              }
            />
          </>
        )}
      </div>
      <button
        onClick={handleSearch}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Search
      </button>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Results:</h3>
        {results.length > 0 ? (
          results.map((item, index) => (
            <div key={index} className="p-4 border rounded mb-2">
              {role === "Employee" ? (
                <>
                  <h4 className="font-bold">{item.title}</h4>
                  <p>Company: {item.companyName}</p>
                  <p>Location: {item.location}</p>
                  <p>Type: {item.time}</p>
                  <p>Salary: ${item.salary}</p>
                </>
              ) : (
                <>
                  <h4 className="font-bold">{item.name}</h4>
                  <p>Skills: {item.skills}</p>
                  <p>Location: {item.location}</p>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
