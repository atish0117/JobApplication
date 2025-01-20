import React, { useState } from "react";
import account from "../../appWrite/AppwriteConfig"; // Import Appwrite config
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setRole } from "../../Redux/features/RoleSlice";

const RoleSelector = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleSelection = async (role) => {  
    try {
      
      dispatch(setRole(role));
      
      // Redirect based on the selected role
      setTimeout(() => {
        navigate(role === "Employee" ? "/EmployeeForm" : "/EmployerForm");
      }, 1000);
    } catch (err) {
      console.error("Error saving role:", err.message);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-300">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Select Your Role
      </h1>
      <div className="flex space-x-6">
        {/* EMPLOYER Radio Button */}
        <label
          className={`cursor-pointer flex flex-col items-center p-4 rounded-lg border-2 
          ${
            selectedRole === "Employer"
              ? "border-yellow-600 bg-yellow-400 text-white"
              : "border-gray-300 bg-white hover:bg-gray-100"
          }`}
        >
          <input
            type="radio"
            name="role"
            value="Employer"
            className="hidden"
            onClick={() => handleRoleSelection("Employer")}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke={selectedRole === "Employer" ? "white" : "black"}
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7a4 4 0 1 1 8 0v2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2V7z"
            />
          </svg>
          <span className="font-semibold text-lg">EMPLOYER</span>
        </label>

        {/* EMPLOYEES Radio Button */}
        <label
          className={`cursor-pointer flex flex-col items-center p-4 rounded-lg border-2 
          ${
            selectedRole === "EMPLOYEE"
              ? "border-yellow-600 bg-yellow-400 text-white"
              : "border-gray-300 bg-white hover:bg-gray-100"
          }`}
        >
          <input
            type="radio"
            name="role"
            value="Employee"
            className="hidden"
            onClick={() => handleRoleSelection("Employee")}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke={selectedRole === "Employee" ? "white" : "black"}
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 18.364a1.5 1.5 0 0 1 0-2.121l5.757-5.758a1.5 1.5 0 0 1 2.121 0l5.757 5.758a1.5 1.5 0 0 1 0 2.121L14.95 21.95a1.5 1.5 0 0 1-2.121 0l-5.757-5.757z"
            />
          </svg>
          <span className="font-semibold text-lg">EMPLOYEES</span>
        </label>
      </div>
      {selectedRole && (
        <p className="mt-4 text-lg font-medium">
          Selected Role: <span className="font-bold">{selectedRole}</span>
        </p>
      )}
    </div>
  );
};

export default RoleSelector;
