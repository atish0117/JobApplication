import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProfile } from "../../Redux/features/PostServiceF";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaHome,
  FaPlusCircle,
  FaTrash,
  FaBriefcase,
  FaSchool
} from "react-icons/fa";
import { GrStatusInfo } from "react-icons/gr";
const EmployeeForm2 = () => {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.role);
  const [formData, setFormData] = useState({
    FullName: "",
    Age: "",
    Gender: "",
    Contact: "",
    email: "",
    Education: "",
    Address: "",
    JobStatus: "",
    college:"",
    skills: [{ skill: "", experience: "" }],
    profileImage: null,
    selfNote: "",
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
    console.log("Image uploaded successfully");
  };

  // Form validation per step
  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.FullName.trim() && formData.Gender && formData.Age;
      case 2:
        return formData.Education && formData.skills.length > 0;
      case 3:
        return formData.profileImage;
      case 4:
        return formData.Contact.trim() && formData.email.trim();
      default:
        return true;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transformedFormData = {
        ...formData,
        skills: formData.skills.map(
          (skill) => `${skill.skill} (${skill.experience} yrs)`
        ),
      };
      dispatch(createProfile({ formData: transformedFormData, role }));
      navigate("/profilepage");
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  // Update specific skill or experience
  const updateSkill = (index, field, value) => {
    setFormData((prevData) => {
      const updatedSkills = [...prevData.skills];
      updatedSkills[index] = {
        ...updatedSkills[index],
        [field]: value,
      };
      return { ...prevData, skills: updatedSkills };
    });
  };

  // Add a new skill
  const addSkill = () => {
    setFormData((prevData) => ({
      ...prevData,
      skills: [...prevData.skills, { skill: "", experience: "" }],
    }));
  };

  // Delete a skill
  const deleteSkill = (index) => {
    setFormData((prevData) => {
      const updatedSkills = [...prevData.skills];
      updatedSkills.splice(index, 1);
      return { ...prevData, skills: updatedSkills };
    });
  };

  // Navigate steps
  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
    else alert("Please complete all required fields before proceeding.");
  };
  const prevStep = () => setStep(step - 1);

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{ backgroundColor: "#F0EDCC" }}
    >
      <div className="flex bg-white shadow-2xl rounded-lg overflow-hidden w-3/4 max-w-4xl h-[500px]">
        <div
          className="w-1/3 bg-cover"
          style={{
            backgroundImage: "url('https://via.placeholder.com/300')",
            backgroundSize: "cover",
          }}
        ></div>
        <form className="w-2/3 p-8 space-y-6" onSubmit={handleSubmit}>
          <div className="w-full bg-gray-300 rounded-full h-2 mb-6">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Personal Details
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <FaUser className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="FullName"
                    value={formData.FullName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="block w-full border border-gray-300 rounded-md pl-10 p-2"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-800 font-medium">Gender</label>
                  <div className="flex space-x-6 mt-1">
                    {["Male", "Female", "Other"].map((genderOption) => (
                      <label
                        key={genderOption}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="radio"
                          name="Gender"
                          value={genderOption}
                          checked={formData.Gender === genderOption}
                          onChange={handleInputChange}
                          required
                        />
                        <span>{genderOption}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="Age"
                    value={formData.Age}
                    onChange={handleInputChange}
                    placeholder="Age"
                    className="block w-full border border-gray-300 rounded-md pl-10 p-2"
                    required
                  />
                </div>
                <div className="relative">
                  <FaHome className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                  <textarea
                    name="Address"
                    value={formData.Address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="block w-full border border-gray-300 rounded-md pl-10 p-2"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Education and Skills
              </h2>
              <div className="relative">
                <label className="block font-medium text-gray-700">
                  Education
                </label>
                <select
                  name="Education"
                  value={formData.Education}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 rounded-md pl-10 p-2"
                  required
                >
                  <option value="">Select education level</option>
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div className="relative mt-2">
                <FaSchool className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  placeholder="School / College / University"
                  className="block w-full border border-gray-300 rounded-md pl-10 p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-800 font-medium">Skills</label>
                <div className="overflow-y-auto max-h-32 border border-gray-300 rounded-md p-2">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-4 mt-2">
                      <input
                        type="text"
                        placeholder="Skill"
                        value={skill.skill}
                        onChange={(e) =>
                          updateSkill(index, "skill", e.target.value)
                        }
                        className="w-1/2 border border-gray-300 rounded-md p-2"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Experience (yrs)"
                        value={skill.experience}
                        onChange={(e) =>
                          updateSkill(index, "experience", e.target.value)
                        }
                        className="w-1/4 border border-gray-300 rounded-md p-2"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => deleteSkill(index)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addSkill}
                  className="mt-4 bg-blue-600 text-white font-bold px-4 py-2 rounded flex items-center"
                >
                  <FaPlusCircle className="mr-2" /> Add Skill
                </button>
              </div>
              <div className="flex justify-between mt-20">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Upload Profile Image
              </h2>
              <div className="mt-20">
                <label
                  htmlFor="profileImg"
                  className="block font-medium text-gray-700"
                >
                  Profile Image
                </label>
                <input
                  type="file"
                  id="profileImg"
                  name="profileImg"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="flex justify-between mt-48">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Contact Details
              </h2>
              <div className="relative mt-8">
                <FaPhone className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="Contact"
                  value={formData.Contact}
                  onChange={handleInputChange}
                  placeholder="Contact Number"
                  className="block w-full border border-gray-300 rounded-md pl-10 p-2"
                  required
                />
              </div>
              <div className="relative mt-8">
                <FaEnvelope className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="block w-full border border-gray-300 rounded-md pl-10 p-2"
                  required
                />
              </div>

                     {/* Job Status */}
          <div className="relative">
            {/* <label className="block font-medium text-gray-700">
              Job Status
            </label> */}
            <div className="relative mt-8">
              <GrStatusInfo className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
              <select
                name="JobStatus"
                value={formData.JobStatus}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md pl-10 p-2"
                required
              >
                <option value="">Select job status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>
                     {/* Languages */}
          <div className="relative">
            {/* <label className="block font-medium text-gray-700">
              Job Status
            </label> */}
            <div className="relative mt-4">
              <GrStatusInfo className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
              <select
                name="JobStatus"
                value={formData.languages}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md pl-10 p-2"
                required
              >
                <option value="">Select Language</option>
                <option value="Active">Hindi</option>
                <option value="Inactive">English</option>
              </select>
            </div>
          </div>

              <div className="flex justify-between mt-16">
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm2;
