import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { signup } from "../../Redux/features/AuthserviceF";
import { useNavigate,Link } from "react-router-dom";
import { login } from "../../Redux/features/AuthserviceF";
import { CiUser,CiMail,CiLock ,CiRead,CiUnread} from "react-icons/ci";
// import { CiMail } from "react-icons/ci";
// import { CiLock } from "react-icons/ci";


const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [verificationMessage, setVerificationMessage] = useState("");

  const [show,setShow] = useState(false);

  const isShow = ()=> setShow(!show)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(signup(data))
      .then((result) => {
        if (result.type === "auth/signup/fulfilled") {
          localStorage.setItem('Token',(data.email));
          setVerificationMessage(
            "Signup successful! Please check your email for the verification link."
          );
            dispatch(login(data))
                .then((result) => {
                  if (result.type === "auth/login/fulfilled") {

                    navigate("/RoleSelector");
                  }
                })
          setTimeout(() => {
            navigate("/RoleSelector");
          }, 3000); // Redirect after 3 seconds
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="h-screen flex justify-center items-center">
      {/* <h1 className="text-2xl font-bold text-center mb-4">Signup</h1> */}

      <form onSubmit={handleSubmit(onSubmit)}>
      {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="  flex justify-between gap-36 border-black borde rounded-xl shadow-2xl p-14">
          {/* <label className="block text-sm font-medium mb-1">Full Name</label> */}
          <div className='flex flex-col justify-between'>
          <span className='text-3xl'>Sign up</span>
          <div className='flex gap-2 border-bottom border-b border-black'>
          <CiUser className='text-xl'/>
          <input
            {...register("fullName", { required: "Full name is required" })}
            className="w-full border-gray-300 rounded px-3 py-2"
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
          </div>

        <div className='flex gap-2 border-bottom border-b border-black'>
        <CiMail className='text-xl'/>
          {/* <label className="block text-sm font-medium mb-1">Email</label> */}
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email",
              },
            })}
            type="email"
            className="w-full border-gray-300 rounded px-3 py-2"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className='flex gap-2 border-bottom border-b border-black'>
          {/* <label className="block text-sm font-medium mb-1">Password</label> */}
          <CiLock className='text-xl'/>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must include uppercase, lowercase, number, and special character",
              },
            })}
            type={show ? "text" : "password"}
            className="w-full border-gray-300 rounded px-3 py-2"
            placeholder="Enter your password"
          />
                    <span onClick={isShow}>
                      {show ? <CiRead/> : <CiUnread/>}
                    </span>
          
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className=''><input className='focus:outline-none mb-1' type="checkbox" />
         I agree all statements in Terms of service
         </div>
            <div className="">
        <button
          type="submit"
          className={`primary-button bg-[#0e1822] text-white px-5 rounded py-2 hover:bg-[#ff4655] transition-all duration-500 ${
            loading ? "bg-gray-400" : "bg-[#0e1822] hover:bg-[#ff4655]"
          }`}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Register"}
        </button>
        </div>
        </div>

        <div className='flex flex-col justify-center items-center'>
            <img src="https://colorlib.com/etc/regform/colorlib-regform-7/images/signup-image.jpg" alt="image" />
          <span className=''> Already have an account?{" "}
          <Link
          to="/login"
          className="text-[#ff4655] hover:text-black hover:underline font-semibold"
        >
          Login
        </Link>
            </span>
        </div>
      
        </div>
      </form>

      {verificationMessage && (
        <div className="mt-4 text-center text-green-500 font-semibold">
          {verificationMessage}
        </div>
      )}
    </div>
  );
};

export default SignupPage;


