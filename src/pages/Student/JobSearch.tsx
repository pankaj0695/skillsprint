import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Job } from "../../types";
import { DashboardLayout } from "../../components/Layout/DashboardLayout";
import { Search } from "lucide-react";
import { JobCard } from "../../components/Job/JobCard";

export const JobSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    location: "all",
    remote: false,
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const jobsData: Job[] = snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : new Date(),
          applicants: Array.isArray(data.applicants) ? data.applicants : [],
        } as Job;
      });
      setJobs(jobsData);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.skillsRequired || []).some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesType = filters.type === "all" || job.type === filters.type;
    const matchesRemote = !filters.remote || job.remote;
    return matchesSearch && matchesType && matchesRemote;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {loading && (
          <div className="flex justify-center items-center py-10">
            <span className="text-gray-500">Loading jobs...</span>
          </div>
        )}
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Jobs</h1>
          <p className="text-gray-600 mt-2">
            Discover opportunities that match your skills and interests
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="internship">Internships</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>

              <label className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={filters.remote}
                  onChange={(e) =>
                    setFilters({ ...filters, remote: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Remote Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}{" "}
              found
            </p>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Most Recent</option>
              <option>Best Match</option>
              <option>Salary: High to Low</option>
              <option>Salary: Low to High</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={{
                  ...job,
                  requirements: (job as any).requirements || "",
                  salary: job.salary || "",
                }}
                onViewDetails={() => navigate(`/jobs/${job.id}`)}
                showViewButton={true}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
