import {  useEffect } from "react";
// import { PlusCircle, LogOut, User } from 'lucide-react';
import { PinData } from "../context/PinContext";
import { Loading } from "../components/Loading";
import PinCard from "../components/PinCard";
// import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
// Button component
// const Button = ({ children, className, ...props }) => (
//   <button
//     className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${className}`}
//     {...props}
//   >
//     {children}
//   </button>
// );

export default function PinterestLayout() {
  const { pins, loading } = PinData(); // Fetch pins and loading state from context
 // Infinite scroll behavior
  const loadMorePins = () => {
    // In a real app, this would fetch more pins from an API
    // Add mock or new data here if needed
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      loadMorePins();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar/>

      {/* Main Content */}
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {loading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pins && pins.length > 0 ? (
                pins.map((pin) => <PinCard key={pin._id} pin={pin} />)
              ) : (
                <p className="col-span-full text-center text-gray-600 text-lg">No Pins Yet</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
