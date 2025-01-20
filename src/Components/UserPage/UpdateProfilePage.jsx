import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../Redux/features/PostServiceF";

const UpdateProfilePage = ({ role }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.form);
  const { userId } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(profile || {});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ userId, formData, role }));
    console.log(formData)
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
      />
      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateProfilePage;
