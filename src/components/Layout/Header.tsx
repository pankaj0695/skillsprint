import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/skill-sprint-logo.png";

export const Header: React.FC = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} className="h-8 w-8" />
            <span className="text-2xl font-bold skill-sprint-logo-text">
              SkillSprint
            </span>
          </Link>

          {currentUser && userProfile ? (
            <div className="flex items-center space-x-3">
              {/* User Profile Section */}
              <Link
                to={userProfile.role === "student" ? "/student" : "/recruiter"}
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors group"
              >
                {/* Profile Picture or Default Icon */}
                <div className="relative">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={userProfile.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <User className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                    </div>
                  )}
                </div>

                {/* User Name and Role */}
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    {userProfile.name}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {userProfile.role}
                  </div>
                </div>
              </Link>

              {/* Logout Button */}
              <div className="h-6 w-px bg-gray-300"></div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/get-started?next=login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition-colors"
              >
                Login
              </Link>
              <Link
                to="/get-started?next=signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
