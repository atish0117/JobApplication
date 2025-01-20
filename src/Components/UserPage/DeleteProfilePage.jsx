import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProfile } from "../../Redux/features/PostServiceF";

const DeleteProfilePage = ({ role }) => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);

  const handleDelete = () => {
    dispatch(deleteProfile({ userId, role }));
  };

  return (
    <button onClick={handleDelete}>Delete Profile</button>
  );
};

export default DeleteProfilePage;
