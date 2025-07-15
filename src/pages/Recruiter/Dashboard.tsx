import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Users, PlusCircle, Eye, Calendar } from "lucide-react";
import { DashboardLayout } from "../../components/Layout/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";
import { JobCard, Job } from "../../components/Job/JobCard";

export const RecruiterDashboard: React.FC = () => {
  const { userProfile, currentUser } = useAuth();
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!currentUser?.uid) return;
      setLoadingJobs(true);
      const q = query(
        collection(db, "jobs"),
        where("recruiterId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
        limit(3)
      );
      const snap = await getDocs(q);
      setRecentJobs(
        snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Job))
      );
      setLoadingJobs(false);
    };
    fetchJobs();
  }, [currentUser]);

  const stats = [
    {
      label: "Active Job Posts",
      value: loadingJobs ? "-" : recentJobs.length.toString(),
      icon: Briefcase,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Applicants",
      value: "142",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Views This Month",
      value: "1,205",
      icon: Eye,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Interviews Scheduled",
      value: "12",
      icon: Calendar,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      if (!currentUser?.uid) return;
      setLoadingJobs(true);
      const q = query(
        collection(db, "jobs"),
        where("recruiterId", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
        limit(3)
      );
      const snap = await getDocs(q);
      setRecentJobs(
        snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Job))
      );
      setLoadingJobs(false);
    };
    fetchJobs();
  }, [currentUser]);

  const recentApplicants = [
    {
      id: "1",
      name: "Sarah Johnson",
      position: "Senior Frontend Developer",
      appliedDate: "2 hours ago",
      skills: ["React", "TypeScript", "Node.js"],
      match: 95,
    },
    {
      id: "2",
      name: "Mike Chen",
      position: "Product Manager",
      appliedDate: "5 hours ago",
      skills: ["Product Strategy", "Analytics", "Agile"],
      match: 88,
    },
    {
      id: "3",
      name: "Emma Wilson",
      position: "UI/UX Designer Intern",
      appliedDate: "1 day ago",
      skills: ["Figma", "User Research", "Prototyping"],
      match: 92,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userProfile?.name?.split(" ")[0]}! 💼
          </h1>
          <p className="text-emerald-100 text-lg">
            Manage your job postings and connect with top talent
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/recruiter/post-job"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
              <PlusCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Post New Job</h3>
            <p className="text-gray-600 text-sm">
              Create a new job posting to attract top talent
            </p>
          </Link>

          <Link
            to="/recruiter/jobs"
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Manage Jobs</h3>
            <p className="text-gray-600 text-sm">
              View and edit your active job postings
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Job Posts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Job Posts
              </h2>
              <Link
                to="/recruiter/jobs"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {loadingJobs ? (
                <div className="text-center text-gray-500 py-8">
                  Loading jobs...
                </div>
              ) : recentJobs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No jobs posted yet.
                </div>
              ) : (
                recentJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onViewDetails={() =>
                      (window.location.href = `/recruiter/jobs/${job.id}`)
                    }
                  />
                ))
              )}
            </div>
          </div>

          {/* Recent Applicants */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Applicants
              </h2>
              <Link
                to="/recruiter/applicants"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {applicant.name}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {applicant.match}% match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {applicant.position}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {applicant.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {applicant.appliedDate}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
