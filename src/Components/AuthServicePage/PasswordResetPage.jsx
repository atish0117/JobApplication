import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../Redux/features/AuthserviceF";
import { useSearchParams } from "react-router-dom";

const PasswordResetPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { loading, error, recoveryStatus } = useSelector((state) => state.auth);

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ userId, secret, newPassword }));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {recoveryStatus && <p className="text-green-500 mb-4">{recoveryStatus}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};
export default PasswordResetPage;