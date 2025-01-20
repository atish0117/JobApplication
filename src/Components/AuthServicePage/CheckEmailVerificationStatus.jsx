import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import checkEmailVerificationStatus  from "../../appWrite/AppwriteConfig";
const CheckEmailVerificationStatus = () => {
  const [isVerified, setIsVerified] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyStatus = async () => {
      try {
        const user = await checkEmailVerificationStatus();
        setIsVerified(user.emailVerification);

        if (!user.emailVerification) {
          setTimeout(() => navigate("/verify-email"), 3000); // Redirect after 3 seconds
        }
      } catch (err) {
        setError(err.message);
      }
    };

    verifyStatus();
  }, [navigate]);

  if (isVerified === null) {
    return <p>Loading verification status...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold text-yellow-500 mb-4">Verification Status</h1>
        {error && <p className="text-red-500">{error}</p>}
        {!error && (
          <p className={`font-semibold ${isVerified ? "text-green-500" : "text-red-500"}`}>
            {isVerified ? "Your email is verified. 🎉" : "Your email is not verified. Redirecting..."}
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckEmailVerificationStatus;
