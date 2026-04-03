import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

export default function MainPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [heroAnimation, setHeroAnimation] = useState(null);
  const [aboutAnimation, setAboutAnimation] = useState(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [scrolling, setScrolling] = useState(true);

  const topics = [
    { title: "AI in Education", image: "https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWl8ZW58MHx8MHx8fDA%3D" },
    { title: "Mathematics for Beginners", image: "https://media.istockphoto.com/id/1183952376/photo/graph-of-parabola.webp?a=1&b=1&s=612x612&w=0&k=20&c=wjTp2hS-p2VADt_LLs4NHdTWPsouuecBTXM44MwCQH4=" },
    { title: "Physics Masterclass", image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGh5c2ljc3xlbnwwfHwwfHx8MA%3D%3D" },
    { title: "Web Development Basics", image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D" },
    { title: "JEE Mains Preparation", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqGekaobKGw6pGFjQGYE-wX-5a9L1yuIn-rg&s" },
  ];

  useEffect(() => {
    fetch("/video.json")
      .then((res) => res.json())
      .then((data) => setHeroAnimation(data))
      .catch((err) => console.error("Error loading hero animation:", err));

    fetch("/about.json")
      .then((res) => res.json())
      .then((data) => setAboutAnimation(data))
      .catch((err) => console.error("Error loading about animation:", err));
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    let scrollInterval;

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft += 5; // Adjust speed as needed
          if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
            scrollRef.current.scrollLeft = 0;
          }
        }
      }, 30);
    };
    if (scrolling) startScrolling();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(scrollInterval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [scrolling]);
  const testimonials = [
    {
      image:
        "https://plus.unsplash.com/premium_photo-1682089897177-4dbc85aa672f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aW5kaWFuJTIwaGlnaCUyMHNjaG9vbCUyMGdpcmx8ZW58MHx8MHx8fDA%3D",
      name: "Ayesha R.",
      quote:
        "This platform has been my learning companion from 7th to 10th grade, making complex topics easy to understand. The interactive lessons and supportive mentors kept me motivated. I'm truly grateful for the knowledge and confidence it has given me!",
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1682089851706-d0d4c95b9b99?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aW5kaWFuJTIwaGlnaCUyMHNjaG9vbCUyMGJveXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Rahul M.",
      quote:
        "Learnify made learning fun! The gamified lessons and real-world applications helped me retain knowledge better. Highly recommended for students!",
    },
    {
      image:
        "https://media.istockphoto.com/id/1077209398/photo/college-boy-stock-image.webp?a=1&b=1&s=612x612&w=0&k=20&c=XVbBflj6-LT8_YRFSb_-LWtV4w1PzQicOM-V9Hnzql8=",
      name: "Ram",
      quote:
        "A great initiative! Transparency and accountability at its best.",
    },
  ];


  return (
    <div className="relative w-full min-h-screen text-black">
      <motion.div
        className="relative w-full min-h-screen flex flex-col items-start justify-center px-6 md:px-10 text-left overflow-hidden"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="absolute top-24 right-6 md:right-10 w-[800px] md:w-[700px] max-w-[45vw]">
          {heroAnimation ? <Lottie animationData={heroAnimation} loop={true} /> : <p>Loading...</p>}
        </div>
        {/* Header */}
        <Header />

        <motion.div
          className="max-w-3xl"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">Empower Learning with AI</h1>
          <p className="text-base md:text-lg mt-4 drop-shadow-md max-w-xl">
            Personalized education for every student, powered by cutting-edge AI technology.
          </p>
          <motion.button
            className="mt-6 bg-black text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-800"
            whileHover={{ scale: 1.1 }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </motion.div>
      {/* Explore Section with 3D Tilt Cards */}
      <section id="explore">
        <div className="max-w-6xl mx-auto my-10 px-6 text-left">
          <h2 className="text-3xl font-bold mb-4">Explore Trending Topics</h2>
          <div
            ref={scrollRef}
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onMouseEnter={() => setScrolling(false)}
            onMouseLeave={() => setScrolling(true)}
            className="flex space-x-4 overflow-x-auto whitespace-nowrap py-4 no-scrollbar"
          >
            {/* Render topics twice for an infinite scroll effect */}
            {[...topics, ...topics].map((topic, index) => (
              <Tilt key={index} options={{ max: 15, scale: 1.05, speed: 700 }}>
                <div className="min-w-[300px] bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-200">
                  <img src={topic.image} alt={topic.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{topic.title}</h3>
                    <p className="text-gray-600 text-sm mt-2">Explore courses and resources</p>
                    <button className="mt-3 text-black hover:text-gray-700">Learn More →</button>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>
      <div>

        {/* ABOUT US SECTION */}
        <section
          id="about"
          className="relative bg-black text-white py-16 px-6 w-full md:rounded-l-full"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">About Us</h2>
            <p className="text-lg text-left text-white mt-4 max-w-3xl mx-auto">
              We are dedicated to empowering students through accessible learning resources,
              mentorship, and hands-on projects. Our goal is to make education engaging and impactful
              for everyone.
            </p>
            {/* About Us Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left - Lottie Animation */}
              <div className="flex justify-center items-center">
                {aboutAnimation ? (
                  <Lottie animationData={aboutAnimation} className="w-[280px] h-[280px] md:w-[400px] md:h-[400px]" />
                ) : (
                  <p className="text-center">Loading animation...</p>
                )}
              </div>

              {/* Right - About Us Text */}
              <div>
                <h3 className="text-2xl font-semibold">Empowering Learners, One Step at a Time</h3>
                <p className="mt-4">
                  At Learnify, we believe that education should be engaging, accessible, and innovative.
                  Our mission is to create a learning ecosystem where students, teachers, and professionals
                  can grow together through technology-driven education.
                </p>
                <h3 className="text-2xl font-semibold mt-6">What Sets Us Apart?</h3>
                <ul className="mt-4 space-y-2">
                  <li>✅ Interactive and personalized learning experience</li>
                  <li>✅ Expert mentors guiding you at every step</li>
                  <li>✅ A collaborative and vibrant learning community</li>
                  <li>✅ Cutting-edge technology and AI-powered resources</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Card */}
      <div className="max-w-6xl mx-auto my-10 px-6 text-left">
        <h2 className="text-3xl font-bold mb-4">Success Stories</h2></div>
      <div className="max-w-3xl mx-auto">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          className="mt-16"
        >
          {testimonials.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="mt-6 mb-10 relative flex items-center bg-[#F8FCFA] p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
                {/* Logo */}
                <div className="absolute -top-6 -left-0 bg-black p-2 rounded-2xl shadow-md ">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-24 h-24 md:w-[104px] md:h-[104px] object-cover rounded-2xl"
                  />
                </div>

                {/* Testimonial Content */}
                <div className="ml-28">
                  <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">
                    Learnify!
                  </p>
                  <blockquote className="text-lg font-medium text-gray-800 mt-2">
                    "{review.quote}"
                  </blockquote>
                  <p className="text-sm text-gray-700 font-semibold mt-4">
                    {review.name}
                  </p>
                  <a
                    href="#"
                    className="mt-4 inline-flex items-center text-green-700 font-medium hover:underline"
                  >
                    Read Customer Story →
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Footer */}
      {/* Footer */}
      <Footer />
      {/* Inline style to hide scrollbar for WebKit browsers */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
