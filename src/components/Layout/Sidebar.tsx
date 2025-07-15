import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  FileText,
  Search,
  MessageCircle,
  Briefcase,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export const Sidebar: React.FC = () => {
  const { userProfile } = useAuth();
  const location = useLocation();

  const studentMenuItems = [
    { path: "/student", icon: Home, label: "Dashboard" },
    { path: "/student/career-path", icon: User, label: "Career Path" },
    { path: "/student/resume", icon: FileText, label: "Resume Builder" },
    { path: "/student/jobs", icon: Search, label: "Find Jobs" },
    { path: "/student/coach", icon: MessageCircle, label: "AI Career Coach" },
  ];

  const recruiterMenuItems = [
    { path: "/recruiter", icon: Home, label: "Dashboard" },
    { path: "/recruiter/jobs", icon: Briefcase, label: "My Job Posts" },
    { path: "/recruiter/post-job", icon: PlusCircle, label: "Post New Job" },
  ];

  const menuItems =
    userProfile?.role === "student" ? studentMenuItems : recruiterMenuItems;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
