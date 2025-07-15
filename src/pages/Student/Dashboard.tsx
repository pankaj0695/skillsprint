import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Search,
  MessageCircle,
  TrendingUp,
  Clock,
  Target,
  Award,
} from "lucide-react";
import { DashboardLayout } from "../../components/Layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";

import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const StudentDashboard: React.FC = () => {
  const { userProfile, currentUser } = useAuth();
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
  const [recommendedSkills, setRecommendedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentUser) return;
      setLoading(true);
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : {};
      // Fetch all courses from Firestore
      let courses: any[] = [];
      try {
        const coursesSnap = await import("firebase/firestore").then(
          ({ getDocs, collection }) => getDocs(collection(db, "courses"))
        );
        courses = coursesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (e) {
        // fallback: no courses
      }
      const recommendedCourseIds = userData.recommendedCourseIds || [];
      const recommendedCourses = courses.filter((c) =>
        recommendedCourseIds.includes(c.id)
      );
      setRecommendedCourses(recommendedCourses);
      setRecommendedSkills(userData.recommendedSkills || []);
      setLoading(false);
    };
    fetchRecommendations();
  }, [currentUser]);

  const stats = [
    {
      label: "Courses",
      value: recommendedCourses.length,
      icon: Award,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Skills",
      value: recommendedSkills.length,
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Job Applications",
      value: "5",
      icon: FileText,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Study Hours",
      value: "24",
      icon: Clock,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userProfile?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            Ready to continue your career journey? Let's make today count!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/student/career-path"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Career Path</h3>
            <p className="text-gray-600 text-sm">
              Explore your personalized learning roadmap
            </p>
          </Link>

          <Link
            to="/student/resume"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Resume Builder</h3>
            <p className="text-gray-600 text-sm">
              Create and optimize your professional resume
            </p>
          </Link>

          <Link
            to="/student/jobs"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <Search className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Find Jobs</h3>
            <p className="text-gray-600 text-sm">
              Discover opportunities that match your skills
            </p>
          </Link>

          <Link
            to="/student/coach"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
              <MessageCircle className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              AI Career Coach
            </h3>
            <p className="text-gray-600 text-sm">
              Get personalized career guidance
            </p>
          </Link>
        </div>

        {/* Recommended Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Recommended Courses
          </h2>
          {loading ? (
            <div className="text-gray-500">Loading recommendations...</div>
          ) : recommendedCourses.length === 0 ? (
            <div className="text-gray-500">
              No recommendations found. Take the career quiz to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {recommendedCourses.map((course, idx) => (
                <div
                  key={course.id || idx}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-md transition"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-700 mb-1">
                      {course.title}
                    </h4>
                    <p className="text-gray-700 mb-2">{course.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Clock className="h-4 w-4 mr-1" /> {course.duration}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {course.tags &&
                        course.tags.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                    <a
                      href={course.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Course
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
