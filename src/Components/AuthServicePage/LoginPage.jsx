import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { login } from "../../Redux/features/AuthserviceF";
import { Link, useNavigate } from "react-router-dom";
import { CiMail,CiLock,CiRead,CiUnread } from "react-icons/ci";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [show,setShow] = useState(false);

  const isShow = ()=> setShow(!show)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(login(data))
      .then((result) => {
        if (result.type === "auth/login/fulfilled") {
          // Save the object to localStorage
          localStorage.setItem("Token", data.email);
          navigate("/profilepage");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="  rounded shadow h-screen flex justify-center items-center">
      {/* <h1 className="text-2xl font-bold text-center mb-4">Login</h1> */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=' flex justify-between gap-36 border-black borde rounded-xl shadow-2xl p-20'>
              <div className='flex flex-col justify-center items-center'>
                <img src="https://colorlib.com/etc/regform/colorlib-regform-7/images/signin-image.jpg" alt="image" />
              </div>
        <div className="flex flex-col justify-between">
        <span className='text-3xl'>Login</span>
          {/* <label className="block text-sm font-medium mb-1">Email</label> */}
          <div className='flex gap-2 border-bottom border-b border-black'>
          <CiMail className='text-xl'/>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email",
              },
            })}
            type="email"
            className="focus:outline-none mb-1 text-1"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4 flex gap-2 border-bottom border-b border-black">
          {/* <label className="block text-sm font-medium mb-1">Password</label> */}
          <CiLock className='text-xl font-black'/>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            type={show ? "text" : "password"}
            className=" focus:outline-none mb-1 text-1 "
            placeholder="Enter your password"
          />
          <span onClick={isShow}>
            {show ? <CiRead/> : <CiUnread/>}
          </span>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
            <div className="">
        <button
          type="submit"
          className={`w-full py-2 rounded primary-button bg-[#0e1822] text-white px-5 hover:bg-[#ff4655] transition-all duration-500 ${
            loading ? "bg-[#0e1822]" : "bg-[#0e1822] hover:bg-[#ff4655]"
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <span className="text-center mt-4 ms-5 cursor-pointer">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="text-[#0e1822] hover:text-[#ff4655] hover:underline font-semibold"
        >
          Signup
        </Link>
        <div className='underline'>
        <Link
          to="/recover-password"
          className="text-[#0e1822] hover:text-[#ff4655] hover:underline font-semibold"
        >
        Forgot Password
        </Link>
          </div>

      </span>
      </div>

          </div>
        </div>
      </form>

     
    </div>
  );
};

export default LoginPage;




