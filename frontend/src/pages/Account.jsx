import  { useState, useCallback } from 'react';
import { PinData } from "../context/PinContext";
import PinCard from "../components/PinCard";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";

const UserProfile = ({ user }) => {
  const navigate = useNavigate();
  const { setIsAuth, setUser } = UserData();
  const { pins } = PinData();

  const [activeTab, setActiveTab] = useState("created");

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      toast.success(data.message);
      navigate("/login");
      setIsAuth(false);
      setUser([]);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  let userPins;
  if (pins) {
    userPins = pins.filter((pin) => pin.owner === user._id);
  }

  const renderPins = useCallback((pins) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {pins.map((pin) => (
        <PinCard key={pin._id} pin={pin} />
      ))}
    </div>
  ), []);

  const handleTabChange = useCallback((value) => {
    setActiveTab(value);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
            <img src={user.profilePicture || "/placeholder.svg?height=128&width=128"} alt={user.name} className="w-full h-full object-cover " />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-gray-800">{user.name}</h1>
          {/* <p className="text-gray-600 mb-2">@{user.username}</p> */}
          <p className="text-center max-w-md mb-4 text-gray-700">{user.bio || "No bio available"}</p>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>{user.followers || 0} followers</span>
            <span>{user.following || 0} following</span>
          </div>
          <button
            onClick={logoutHandler}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600 transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 px-4 text-center ${activeTab === 'created' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l-lg transition-colors duration-300`}
            onClick={() => handleTabChange('created')}
          >
            Created Pins
          </button>
          {/* <button
            className={`flex-1 py-2 px-4 text-center ${activeTab === 'saved' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r-lg transition-colors duration-300`}
            onClick={() => handleTabChange('saved')}
          >
            Saved Pins
          </button> */}
        </div>
        {activeTab === 'created' && (
          userPins && userPins.length > 0 ? (
            renderPins(userPins)
          ) : (
            <p className="text-center text-gray-600">No Pins Created Yet</p>
          )
        )}
        {/* {activeTab === 'saved' && (
          user.savedPins && user.savedPins.length > 0 ? (
            renderPins(user.savedPins)
          ) : (
            <p className="text-center text-gray-600">No Pins Saved Yet</p>
          )
        )} */}
      </div>
    </div>
  );
};

export default UserProfile;