import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PinData } from "../context/PinContext";
import PinCard from "../components/PinCard";
import { UserData } from "../context/UserContext";

const UserProfile = ({ user: loggedInUser }) => {
  const params = useParams();
  const [user, setUser] = useState([]);

  async function fetchUser() {
    try {
      const { data } = await axios.get(`/api/user/${params.id}`);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  }

  const [isFollow, setIsFollow] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const { followUser } = UserData();

  const followHander = async () => {
    setFollowLoading(true);
    await followUser(user._id, fetchUser);
    setFollowLoading(false);
  };

  const followers = user.followers;

  useEffect(() => {
    if (followers && followers.includes(loggedInUser._id)) setIsFollow(true);
  }, [user]);

  const { pins } = PinData();

  let userPins;

  if (pins) {
    userPins = pins.filter((pin) => pin.owner === user._id);
  }

  useEffect(() => {
    fetchUser();
  }, [params.id]);
  return (
    <div className="pt-6 sm:px-8 bg-white min-h-screen">
      {user && (
        <div className="flex flex-col items-center justify-center">
          <div className="p-6 w-full">
            <div className="flex items-center justify-center mt-8 mb-4">
              <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name || 'Profile'}
                    className="w-full h-full object-cover"
                    style={{ height: '100%', width: '100%', maxHeight: '150px', maxWidth: '150px', minHeight: '96px', minWidth: '96px', borderRadius: '9999px', objectFit: 'cover' }}
                  />
                ) : user.name ? (
                  <span className="text-3xl text-gray-700">
                    {user.name.slice(0, 1)}
                  </span>
                ) : null}
              </div>
            </div>

            <h1 className="text-center text-2xl font-bold mt-4">{user.name}</h1>
            <p className="text-center text-gray-600 mt-2">{user.email}</p>
            <p className="flex justify-center items-center text-center gap-3 text-gray-600 mt-2">
              {user.followers && <p>{user.followers.length} followers</p>}
              {user.following && <p>{user.following.length} followings</p>}
            </p>
            {user && user._id === loggedInUser._id ? (
              ""
            ) : (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={followHander}
                  className={`px-4 py-2 rounded transition-colors duration-200 ${followLoading ? '' : isFollow ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
                  disabled={followLoading}
                >
                  {followLoading
                    ? "Processing..."
                    : isFollow
                    ? "Unfollow"
                    : "Follow"}
                </button>
              </div>
            )}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
              {userPins && userPins.length > 0 ? (
                userPins.map((e) => <PinCard key={e._id} pin={e} />)
              ) : (
                <p>No Pin Yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
