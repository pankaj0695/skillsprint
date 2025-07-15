import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { DashboardLayout } from "../../components/Layout/DashboardLayout";
import { Job, JobCard } from "../../components/Job/JobCard";

export const RecruiterJobs: React.FC = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      if (!currentUser?.uid) return;
      setLoading(true);
      const q = query(
        collection(db, "jobs"),
        where("recruiterId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setJobs(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Job)));
      setLoading(false);
    };
    fetchJobs();
  }, [currentUser]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">My Posted Jobs</h1>
        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No jobs posted yet.
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onViewDetails={() => navigate(`/jobs/${job.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
