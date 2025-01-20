import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { verifyEmail } from "../../Redux/features/AuthserviceF";

const VerificationPage = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  console.log("this is my userId", userId)
  console.log( "this is my Secret code",secret)
  const dispatch = useDispatch();
  const { loading, verificationStatus, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userId && secret) {
      dispatch(verifyEmail({ userId, secret }));
    }
  }, [dispatch, userId, secret]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold text-yellow-500 mb-4">Email Verification</h1>
        {loading && <p className="text-gray-500">Verifying your email...</p>}
        {verificationStatus && (
          <p className="text-green-500 font-semibold">{verificationStatus}</p>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !verificationStatus && !error && (
          <p className="text-gray-700">Processing your verification...</p>
        )}
        <a
          href="/"
          className="mt-6 inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default VerificationPage;
