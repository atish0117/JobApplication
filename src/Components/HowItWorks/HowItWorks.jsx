import React from "react";
import './HowItWorks.css'


const HowItWorks = () => {
  const steps = [
    {
      title: "Create an Account",
      description: "Sign up as a job seeker or employer to get started.",
      image: "https://cdn.dribbble.com/userupload/10600318/file/original-e75c176b1357a2ced89b463c11506d84.jpg?resize=1024x768&vertical=center",
    },
    {
      title: "Post or Search Jobs",
      description: "Employers can post jobs, and job seekers can search for opportunities.",
      image: "https://cdn.dribbble.com/userupload/16042603/file/original-658d1ab3c0a8ccf7ef05ac4456b4d5f5.jpg?resize=1024x768&vertical=center",
    },
    {
      title: "Get Matched",
      description: "Our system matches candidates with the best jobs for them.",
      image: "https://cdn.dribbble.com/userupload/10404321/file/original-02c079cd8b1c886f4f321d519d1bb696.png?resize=1024x768&vertical=center",
    },
    {
      title: "Achieve Success",
      description: "Apply, hire, and succeed in your career or business!",
      image: "https://cdn.dribbble.com/userupload/16042467/file/original-f85a3db699d2165f0dc09d54facaf960.jpg?resize=1024x768&vertical=center",
    },
  ];

  return (
    <section className="how-it-works">
      <h2 className="section-title">How It Works</h2>
      <div className="steps">
        {steps.map((step, index) => (
          <div key={index} className="step-card">
            <img src={step.image} alt={step.title} className="step-image" />
            <h3 className="step-title">{step.title}</h3>
            <p className="step-description">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
