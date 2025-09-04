import React, { useState } from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Profile from './Profile';

interface HeaderProps {
  onMenuToggle: () => void;
  onGoToDashboard: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, onGoToDashboard }) => {
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Task Manager</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Global Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = searchInput.trim();
              if (!q) return;
              navigate(`/tasks?q=${encodeURIComponent(q)}`);
            }}
            className="relative hidden md:block"
            role="search"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search tasks..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const q = (e.target as HTMLInputElement).value.trim(); if (q) navigate(`/tasks?q=${encodeURIComponent(q)}`); } }}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              aria-label="Search tasks"
              autoComplete="off"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </form>

          {/* Notifications */}
          <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <button
            onClick={toggleProfile}
            className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <img
              src={user?.avatar || "https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="hidden md:block text-sm font-medium">{user?.name || 'John Doe'}</span>
            <User className="h-4 w-4" />
          </button>
        </div>
      </header>

      <Profile 
        isOpen={isProfileOpen} 
        onClose={toggleProfile}
        onGoToDashboard={onGoToDashboard}
      />
    </>
  );
};

export default Header;