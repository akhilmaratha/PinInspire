import  { useState, useCallback, useEffect } from 'react';
import { PinData } from "../context/PinContext";
import PinCard from "../components/PinCard";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { FaPen } from 'react-icons/fa';

const UserProfile = ({ user }) => {
  const navigate = useNavigate();
  const { setIsAuth, setUser } = UserData();
  const { pins } = PinData();

  const [activeTab, setActiveTab] = useState("created");
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [uploading, setUploading] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [savedPins, setSavedPins] = useState([]);

  // Keep local state in sync with user prop
  useEffect(() => {
    setName(user.name);
    setBio(user.bio);
    setProfilePicture(user.profilePicture);
  }, [user]);

  useEffect(() => {
    if (activeTab === 'saved') {
      axios.get('/api/pin/savedpins', { withCredentials: true })
        .then(res => {
          // Ensure proper pin object structure for PinCard
          if (Array.isArray(res.data)) {
            setSavedPins(res.data.filter(pin => pin && pin.image && pin.image.url));
          } else {
            setSavedPins([]);
          }
        })
        .catch(() => setSavedPins([]));
    }
  }, [activeTab]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put('/api/user/update', { name, bio });
      toast.success(data.message);
      setUser(data.user);
      setEditMode(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleImageIconClick = () => setShowImagePopup(true);
  const handleImagePopupClose = () => {
    setShowImagePopup(false);
    setSelectedFile(null);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleProfilePopupSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      // If a new image is selected, upload it
      let updatedProfilePicture = profilePicture;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const { data } = await axios.post("/api/user/profile-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        });
        updatedProfilePicture = data.profilePicture;
        setProfilePicture(data.profilePicture);
        setUser(data.user);
        toast.success("Profile image updated");
      }
      // Always update name and bio
      const { data: updateData } = await axios.put('/api/user/update', { name, bio });
      setUser(updateData.user);
      toast.success(updateData.message);
      handleImagePopupClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 relative group">
            <img src={profilePicture || "../assets/placeholder_img.jpeg"} className="w-full h-full object-cover" />
            <FaPen 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-black rounded-full p-2 cursor-pointer hover:text-blue-500 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              size={30} 
              onClick={handleImageIconClick} 
            />
          </div>
          {showImagePopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-lg p-6 shadow-lg relative w-80">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                  onClick={handleImagePopupClose}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-lg font-semibold mb-4 text-center">Update Profile</h2>
                <form onSubmit={handleProfilePopupSubmit} className="flex flex-col items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="mb-4"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Name"
                  />
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Bio"
                  />
                  {uploading && <div className="text-blue-500 mb-2">Updating...</div>}
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    disabled={uploading}
                  >
                    {uploading ? "Updating..." : "Update"}
                  </button>
                </form>
              </div>
            </div>
          )}
          {editMode ? (
            <form onSubmit={handleUpdate} className="w-full max-w-sm">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-2 p-2 border" />
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full mb-2 p-2 border" />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </form>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-2 text-gray-800">{name}</h1>
              <p className="text-center max-w-md mb-4 text-gray-700">{bio || "No bio available"}</p>
            </>
          )}
          <div className="flex gap-4 text-sm text-gray-600">
            <span>{user.followers.length || 0} followers</span>
            <span>{user.following.length || 0} following</span>
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
            className={`flex-1 py-2 px-4  text-center ${activeTab === 'created' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l-lg transition-colors duration-300`}
            onClick={() => handleTabChange('created')}
          >
            Created Pins
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${activeTab === 'saved' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r-lg transition-colors duration-300`}
            onClick={() => handleTabChange('saved')}
          >
            Saved Pins
          </button>
        </div>
        {activeTab === 'created' && (
          userPins && userPins.length > 0 ? (
            renderPins(userPins)
          ) : (
            <p className="text-center text-gray-600">No Pins Created Yet</p>
          )
        )}
        {activeTab === 'saved' && (
          savedPins && savedPins.length > 0 ? (
            renderPins(savedPins)
          ) : (
            <p className="text-center text-gray-600">No Pins Saved Yet</p>
          )
        )}
      </div>
    </div>
  );
};

export default UserProfile;