import { FaBell, FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { PinData } from '../context/PinContext';
import { UserData } from '../context/UserContext';

const Navbar = () => {
  const { searchQuery, setSearchQuery } = PinData();
  const { user } = UserData();

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-2">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Pinterest-logo.png/600px-Pinterest-logo.png"
              alt="Pinterest Logo"
              className="h-8"
            />
            <span className="text-xl font-bold text-red-600">Pinterest</span>
          </Link>

          <div className="flex-grow px-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search for ideas"
                  className="w-full h-10 border rounded-full border-black pl-10 pr-4"
                  value={searchQuery}
                  onChange={handleInputChange}
                />
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/create" className="text-gray-700 hover:text-gray-900">
              Create
            </Link>
            <button className="rounded-full p-2 hover:bg-gray-100">
              <FaBell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </button>
            <button className="rounded-full p-2 hover:bg-gray-100">
              <span className="sr-only">Create</span>
            </button>
            <Link
              to="/account"
              className="h-11 w-11 rounded-full bg-gray-300 flex items-center justify-center text-xl text-gray-700 overflow-hidden"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.slice(0, 1).toUpperCase() || <FaUser className="h-5 w-5" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
