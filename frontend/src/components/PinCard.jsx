import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const PinCard = ({ pin }) => {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div className="p-4 w-full">
      <div className="bg-white overflow-hidden shadow rounded-lg relative group cursor-pointer">
        <img src={pin.image.url} alt={pin.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex flex-col justify-center items-center gap-2">
            <Link
              to={`/pin/${pin._id}`}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              View Pin
            </Link>
          </div>
        </div>
        <button
          onClick={toggleLike}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 opacity-0 group-hover:opacity-100"
        >
          <FaHeart className={`w-6 h-6 ${isLiked ? 'text-red-600' : 'text-gray-400'}`} />
        </button>
      </div>
      <div className="mt-2">
        <h2 className="font-bold text-lg text-gray-800">{pin.title}</h2>
        <p className="text-sm text-gray-600">{pin.description}</p>
      </div>
    </div>
  );
};

export default PinCard;