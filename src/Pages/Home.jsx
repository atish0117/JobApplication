import React,{useState, useEffect} from 'react';
import { FaSlack } from "react-icons/fa";
import { FaSpotify } from "react-icons/fa";
import { FaHubspot } from "react-icons/fa";
import { FaAirbnb } from "react-icons/fa";
import img from '../assets/Pasted image.png';
import img5 from  "../assets/img5.jpg"
import img6 from  "../assets/img6.jpg"
import img7 from  "../assets/img7.jpg"
import img8 from  "../assets/img8.jpg"
import { GoArrowUp } from "react-icons/go";



export default function App() {
 const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is JobFinder?",
      answer: "JobFinder is a platform that connects job seekers with top employers in various industries.",
    },
    {
      question: "How do I apply for a job?",
      answer: "You can apply for jobs by signing up, creating a profile, and submitting applications directly to job postings.",
    },
    {
      question: "Is JobFinder free to use?",
      answer: "Yes, JobFinder is completely free for job seekers. Employers may have premium posting options.",
    },
    {
      question: "How can I improve my chances of getting hired?",
      answer: "Make sure your profile is complete, tailor your resume to each job, and use our career resources for tips.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const features = [
    {
      title: "Wide Range of Opportunities",
      description: "Access a variety of job postings tailored to your skills and preferences.",
      image: "https://ideogram.ai/assets/progressive-image/balanced/response/MFumL3ETQ_OqEg6udNTfrg",
    },
    {
      title: "Easy Application Process",
      description: "Apply for jobs effortlessly with our user-friendly platform.",
      image: "https://ideogram.ai/assets/progressive-image/balanced/response/W1hxxgxeSPu3BN74owojiw",
    },
    {
      title: "Trusted by Employers",
      description: "We connect you with reputable companies looking for top talent.",
      image: "https://ideogram.ai/assets/progressive-image/balanced/response/6N33EZNoTAauTZn9Af0XLQ",
    },
    {
      title: "Career Growth Support",
      description: "Receive resources and tips to grow and succeed in your career.",
      image: "https://ideogram.ai/assets/progressive-image/balanced/response/cnTUJhSnQhe65lhx3GaUiw",
    },
  ];
  const steps = [
    {
      title: "Create an Account",
      description: "Sign up as a job seeker or employer to get started.",
      image: img5,
    },
    {
      title: "Post or Search Jobs",
      description: "Employers can post jobs, and job seekers can search for opportunities.",
      image: img6,
    },
    {
      title: "Get Matched",
      description: "Our system matches candidates with the best jobs for them.",
      image: img7,
    },
    {
      title: "Achieve Success",
      description: "Apply, hire, and succeed in your career or business!",
      image: img8,
    },
  ];

  const [visibleSteps, setVisibleSteps] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSteps((prev) => [...prev, entry.target.dataset.index]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const stepElements = document.querySelectorAll(".timeline-step");
    stepElements.forEach((el) => observer.observe(el));

    return () => {
      stepElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  return (
    <>
      <div className='h-lvh  mx-32 flex'>

        <div className='flex flex-col w-1/2 h-full  p-5'>

          <div className='flex justify-between p-5'>
            <span className='text-5xl'>Logo</span>
            <span >
              <span className='text-xl border border-black px-5 py-2'>Login</span>
              <span className='text-xl border border-black px-5 py-2 ms-2'>signup</span>
            </span>
          </div>

          <div className='grow flex flex-col gap-2 justify-center bg-no-repeat bg-left bg-contain bg-[url("https://img.freepik.com/premium-vector/arrow-futuristic-gradient-design-269-wallpaper-background-vector_678192-856.jpg?semt=ais_hybrid")]'>
            <span className='text-8xl'>Find a Job</span>
            <span className='text-8xl'>the easy way</span>
            <span className='text-2xl mt-5'>We can help you to find the best</span>
            <span className='text-2xl'>Employee/Employer</span>
            <span className='flex gap-2 mt-5'>
              <div class="button-borders">
                <button class="primary-button"> I want to Work
                </button>
                <button class="primary-button"> I want to Hire
                </button>
              </div>
            </span>
          </div>

            <span className='mb-10'>
              <span className='text-xl'>Trusted by</span>
              <span className='flex  gap-10 text-4xl mt-2'>
                <span><FaSlack /></span> <span><FaSpotify /></span><span><FaHubspot /></span><span><FaAirbnb /></span>
              </span>
            </span>

        </div>

        <div className='w-1/2 h-full flex py-5'>
          <img src={img} alt="" classame='object-cover'  />

        </div>

      </div>
          <section className="py-16 bg-gray-50 text-black font-sans">
      <h2 className="text-4xl text-center font-bold text-gray-800">
        How It Works
      </h2>
      <div className="relative w-f mx-32 px-8">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-16">
          {/* Horizontal Timeline Line */}
          <div className="absolute top-1/2 w-full h-2 bg-gray-300 -translate-y-1/2 hidden md:block"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              data-index={index}
              className={`timeline-step relative flex flex-col items-center md:w-1/4 text-center transition-transform duration-500 ease-out ${
                visibleSteps.includes(index.toString())
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div
                className={`relative mb-8 ${
                  index % 2 === 0 ? "mt-16 md:mb-24" : "mt-24 md:mb-16"
                }`}
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-72 h-72 md:w-80 md:h-80 border border-gray-300 rounded-lg object-cover shadow-lg mb-4"
                />
              </div>
              <div className="">
                <h3 className="text-xl font-semibold text-gray-700 ">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
              <div className="py-16 px-5 bg-gray-100 text-center">
            <h2 className="text-4xl font-poppins text-black mb-12">Our Achievements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-screen-xl mx-auto">
                {/* Stats 1 */}
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg transform transition-all hover:translate-y-2 hover:shadow-xl flex flex-col items-center text-center">
                    <div className="mb-6">
                        <img src="https://cdn.leonardo.ai/users/8248f95a-b858-41b2-b9b1-9030b634d054/generations/851ad8ca-2fac-4fe0-8129-fed47941a5b3/segments/4:4:1/Flux_Dev_A_vibrant_illustration_showcasing_a_professional_job__3.jpeg?w=512" alt="Stat 1 Illustration" className="w-full max-w-[180px]" />
                    </div>
                    <div className="text-black">
                        <h3 className="text-3xl font-poppins text-blue-600 mb-2">10K+</h3>
                        <p className="text-lg text-gray-700">Jobs Posted</p>
                    </div>
                </div>

                {/* Stats 2 */}
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg transform transition-all hover:translate-y-2 hover:shadow-xl flex flex-col items-center text-center">
                    <div className="mb-6">
                        <img src="https://cdn.leonardo.ai/users/8248f95a-b858-41b2-b9b1-9030b634d054/generations/fe4d165b-4dc6-4fd6-815d-c03ca439ae77/segments/4:4:1/Flux_Dev_An_engaging_illustration_highlighting_5K_Employers_Re_3.jpeg" alt="Stat 2 Illustration" className="w-full max-w-[180px]" />
                    </div>
                    <div className="text-black">
                        <h3 className="text-3xl font-poppins text-blue-600 mb-2">5K+</h3>
                        <p className="text-lg text-gray-700">Employers Registered</p>
                    </div>
                </div>

                {/* Stats 3 */}
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg transform transition-all hover:translate-y-2 hover:shadow-xl flex flex-col items-center text-center">
                    <div className="mb-6">
                        <img src="https://cdn.leonardo.ai/users/403e5bfc-d75a-4667-be57-d45944177f14/generations/124c40a5-902f-4617-bc5b-d8f880e4deae/Leonardo_Phoenix_10_A_dynamic_illustration_showcasing_20K_Job_1.jpg" alt="Stat 3 Illustration" className="w-full max-w-[180px]" />
                    </div>
                    <div className="text-black">
                        <h3 className="text-3xl font-poppins text-blue-600 mb-2">20K+</h3>
                        <p className="text-lg text-gray-700">Job Seekers</p>
                    </div>
                </div>

                {/* Stats 4 */}
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg transform transition-all hover:translate-y-2 hover:shadow-xl flex flex-col items-center text-center">
                    <div className="mb-6">
                        <img src="https://cdn.leonardo.ai/users/403e5bfc-d75a-4667-be57-d45944177f14/generations/ae85598d-c709-406b-8d4b-3383c5fbb4e6/Leonardo_Phoenix_10_An_uplifting_illustration_highlighting_98_3.jpg?w=512" alt="Stat 4 Illustration" className="w-full max-w-[180px]" />
                    </div>
                    <div className="text-black">
                        <h3 className="text-3xl font-poppins text-blue-600 mb-2">98%</h3>
                        <p className="text-lg text-gray-700">Customer Satisfaction</p>
                    </div>
                </div>
            </div>
        </div>
          <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <h2 className="text-4xl font-semibold text-center text-gray-800 mb-12">
        Why Choose Us
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-full mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-all hover:scale-105 duration-300"
          >
            {/* Image Section */}
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full md:w-80 lg:w-96 h-56 object-cover mb-6 rounded-lg border border-gray-300"
            />
            {/* Text Section */}
            <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 text-center">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
          <section className="py-10 bg-white text-black">
      <h2 className="text-3xl font-bold text-center mb-10">
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between max-w-7xl mx-auto">
        {/* Image Section */}
        <div className="flex-shrink-0 w-full md:w-1/3 h-1/3 flex items-center">
          <img
            src="https://cdn.leonardo.ai/users/8248f95a-b858-41b2-b9b1-9030b634d054/generations/8aed6a1b-be85-44c9-91b4-06f6619d7692/segments/3:4:1/Flux_Dev_The_scene_features_a_sleek_minimalist_design_with_a_2.jpeg"
            alt="FAQ Illustration"
            className="w-full max-w-lg border border-black rounded-lg"
          />
        </div>

        {/* FAQ Section */}
        <div className="w-full md:w-2/3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`mb-4 p-4 border border-black rounded-lg transition-transform duration-300 ease-in-out ${
                openIndex === index ? "bg-black text-white transform scale-105" : ""
              }`}
            >
              <div
                className="flex justify-between items-center text-xl font-semibold cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <GoArrowUp
                  className={`transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </div>
              <div
                className={`mt-2 text-lg transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
          <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Description */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl font-bold">JobFinder</h2>
            <p className="text-lg mt-2">
              Connecting top talent with leading employers.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12 text-center md:text-left">
            <div>
              <h3 className="text-xl font-semibold">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#home" className="hover:text-gray-400">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#jobs" className="hover:text-gray-400">
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="#employers" className="hover:text-gray-400">
                    Employers
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-gray-400">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-gray-400">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-semibold">Follow Us</h3>
              <div className="mt-4 space-x-6">
                <a href="#" className="hover:text-gray-400">
                  <i className="fab fa-facebook"></i> Facebook
                </a>
                <a href="#" className="hover:text-gray-400">
                  <i className="fab fa-twitter"></i> Twitter
                </a>
                <a href="#" className="hover:text-gray-400">
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
                <a href="#" className="hover:text-gray-400">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2025 JobFinder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    </>
  )
}