import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const Header = ({ isDemoMode, setIsDemoMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const { getCartCount } = useCart();
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const cartCount = getCartCount();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate('/');
  };

  return (
    <header className="bg-[#232F3E] text-white sticky top-0 z-50 shadow-lg">
      {/* Top Header */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-white">
              <span className="text-[#FF9900]">Amazon</span>
              <span className="text-xs text-gray-300 block">replica</span>
            </div>
          </Link>

          {/* Delivery Location */}
          <div className="hidden md:flex flex-col cursor-pointer hover:text-[#FF9900]">
            <span className="text-xs text-gray-300">Deliver to</span>
            <span className="text-sm font-semibold flex items-center">
              📍 {user.name} — Delhi
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 relative">
            <form onSubmit={handleSearch}>
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search for mobiles, accessories, offers..."
                  className="w-full px-4 py-2 text-gray-800 rounded-l focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                />
                <button
                  type="submit"
                  className="bg-[#FF9900] hover:bg-[#e68900] px-6 py-2 rounded-r font-semibold"
                >
                  🔍
                </button>
              </div>
            </form>

            {/* Search Suggestions */}
            {showSuggestions && searchQuery && (
              <div className="absolute top-full left-0 right-0 bg-white text-gray-800 shadow-lg rounded-b mt-1">
                <div className="p-2 border-b">
                  <div className="text-sm text-gray-600">Suggestions for "{searchQuery}"</div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {['mobile', 'electronics', 'fashion'].map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
                        setSearchQuery(suggestion);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {/* Demo Mode Toggle */}
            <div className="hidden md:flex items-center">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isDemoMode}
                    onChange={(e) => setIsDemoMode(e.target.checked)}
                  />
                  <div className={`block w-10 h-6 rounded-full ${isDemoMode ? 'bg-[#FF9900]' : 'bg-gray-600'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isDemoMode ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-2 text-xs text-gray-300">Demo Mode</div>
              </label>
            </div>

            {/* Returns & Orders */}
            <Link to="/orders" className="hidden md:flex flex-col hover:text-[#FF9900]">
              <span className="text-xs text-gray-300">Returns</span>
              <span className="text-sm font-semibold">& Orders</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative flex items-center hover:text-[#FF9900]">
              <span className="text-2xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF9900] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
              <span className="hidden md:inline ml-1 text-sm font-semibold">Cart</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center hover:text-[#FF9900]"
              >
                <div className="text-left">
                  <span className="text-xs text-gray-300">Hello, {user.name}</span>
                  <span className="text-sm font-semibold block">Account</span>
                </div>
                <span className="ml-1">▼</span>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg py-1 z-50">
                  <Link
                    to="/account"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden bg-[#232F3E] border-t border-gray-600 fixed bottom-0 left-0 right-0">
        <div className="flex justify-around py-2">
          <Link to="/" className="flex flex-col items-center text-white">
            <span>🏠</span>
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/" className="flex flex-col items-center text-white">
            <span>📱</span>
            <span className="text-xs">Categories</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center text-white relative">
            <span>🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#FF9900] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-xs">Cart</span>
          </Link>
          <Link to="/account" className="flex flex-col items-center text-white">
            <span>👤</span>
            <span className="text-xs">Account</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
