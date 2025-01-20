import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import formImg from "../../assets/formimg.jpg"
import {
  FiImage,
  FiUser,
  FiHome,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiClipboard,
  FiClock,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { createProfile } from "../../Redux/features/PostServiceF";

const EmployerForm = () => {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.role);
  const [formData, setFormData] = useState({
    FullName: "",
    orgName: "",
    post: "",
    email: "",
    Contact: "",
    skills: "",
    industry: "",
  });

  const handleInputChange  = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

     // Handle image upload
      const handleImageUpload = (e) => {
    
      setFormData({ ...formData, profileImage: e.target.files[0] });
      console.log("Image uploaded Successfully", formData.profileImage);
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(createProfile({ formData, role }));
      console.log("Form Submitted:",formData)

    } catch (error) {
      console.log("error",error.msg)
    }
    navigate("/profilepage");
  };
  console.log("Form Submit:",formData)

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex w-full max-w-5xl bg-white rounded-lg shadow-md overflow-hidden">
        {/* Image Section */}
        <div className="w-1/3 bg-yellow-400 flex justify-center items-center">
        <img src={formImg} alt="" />

        </div>

        {/* Form Section */}
        <div className="w-2/3 p-10">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Step {step} of 3</h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <>
                {/* Profile Image */}
                <div>
                  <label htmlFor="profileImg" className="block font-medium text-gray-700">
                    Profile Image
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md p-3">
                    <FiImage className="h-6 w-6 text-gray-400" />
                    <input
                      type="file"
                      id="profileImg"
                      name="profileImg"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="ml-3 flex-1 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md p-3">
                    <FiUser className="h-6 w-6 text-gray-400" />
                    <input
                      type="text"
                      id="fullName"
                      name="FullName"
                      value={formData.FullName}
                      placeholder="Enter your full name"
                      onChange={handleInputChange}
                      className="ml-3 flex-1 focus:outline-none text-gray-600"
                      required
                    />
                  </div>
                </div>

                {/* Organization Name */}
                <div>
                  <label htmlFor="orgName" className="block font-medium text-gray-700">
                    Organization & Company Name
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg p-3">
                    <FiHome className="h-6 w-6 text-gray-400" />
                    <input
                      type="text"
                      id="orgName"
                      name="orgName"
                      value={formData.orgName}
                      placeholder="Enter organization name"
                      onChange={handleInputChange}
                      className="ml-3 flex-1 focus:outline-none text-gray-600"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* Post */}
                <div>
                  <label htmlFor="post" className="block font-medium text-gray-700">
                    Post
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md p-3">
                    <FiBriefcase className="h-6 w-6 text-gray-400" />
                    <input
                      type="text"
                      id="post"
                      name="post"
                      value={formData.post}
                      placeholder="Enter your post/designation"
                      onChange={handleInputChange}
                      className="ml-3 flex-1 focus:outline-none text-gray-600"
                      required
                    />
                  </div>
                </div>

                {/* Professional Email */}
                <div>
                  <label htmlFor="email" className="block font-medium text-gray-700">
                    Professional Email
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg p-3">
                    <FiMail className="h-6 w-6 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      placeholder="Enter your professional email"
                      onChange={handleInputChange}
                      className="ml-3 flex-1 focus:outline-none text-gray-600"
                      required
                    />
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <label htmlFor="contact" className="block font-medium text-gray-700">
                    Contact
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg p-3">
                    <FiPhone className="h-6 w-6 text-gray-400" />
                    <input
                      type="tel"
                      id="contact"
                      name="Contact"
                      value={formData.Contact}
                      placeholder="Enter your contact number"
                      onChange={handleInputChange}
                      className="ml-3 flex-1 focus:outline-none text-gray-600"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>/
                {/* Skills */}
                <div>
                  <label htmlFor="skills" className="block font-medium text-gray-700">
                    Skills
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg p-3">
                    <FiClipboard className="h-6 w-6 text-gray-400" />
                    <textarea
                      id="skills"
                      name="skills"
                      placeholder="List the skills you need"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="ml-3 flex-1 focus:outline-none resize-none text-gray-600"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <label htmlFor="experience" className="block font-medium text-gray-700">
                  Industry
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg p-3">
                    <FiClock className="h-6 w-6 text-gray-400" />
                    <input
                      type="text"
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      placeholder="e.g., 2 years, 3 months"
                      onChange={handleInputChange}
                      className="ml-3 flex-1 focus:outline-none text-gray-600"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-yellow-400 text-white py-2 px-6 rounded-lg hover:bg-yellow-600"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-yellow-400 text-white py-2 px-6 rounded-lg hover:bg-yellow-600"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerForm;
