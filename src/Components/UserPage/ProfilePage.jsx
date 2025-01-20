import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../Redux/features/PostServiceF";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, role, loading, error } = useSelector((state) => state.form);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
console.log(profile)

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
        {profile ? (
          <div className="mt-4">
            <p>
              <strong>Full Name:</strong> {profile.FullName}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Role:</strong> {role}
            </p>
            {role === "Employee" && (
              <>
                <p>
                  <strong>Job Status:</strong> {profile.JobStatus}
                </p>
                <p>
                  <strong>Skills:</strong>{" "}
                  {profile.skills
                    ? profile.skills.join(", ")
                    : "No skills added"}
                </p>
              </>
            )}
            {role === "Employer" && (
              <>
                <p>
                  <strong>Company Name:</strong> {profile.CompanyName}
                </p>
                <p>
                  <strong>Industry:</strong> {profile.Industry}
                </p>
              </>
            )}
          </div>
        ) : (
          <p>No profile found.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
