import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">You do not have permission to view this page.</p>
        <Link to="/" className="text-yellow-500 underline">
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
