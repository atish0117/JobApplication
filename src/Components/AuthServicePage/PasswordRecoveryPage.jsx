import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recoverPassword } from "../../Redux/features/AuthserviceF";
import { useSearchParams } from "react-router-dom";


const PasswordRecoveryPage = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading, error, recoveryStatus } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(recoverPassword(email));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold text-center mb-4">Recover Password</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {recoveryStatus && <p className="text-green-500 mb-4">{recoveryStatus}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {loading ? "Sending..." : "Send Recovery Email"}
        </button>
      </form>
    </div>
  );
};

export default PasswordRecoveryPage;