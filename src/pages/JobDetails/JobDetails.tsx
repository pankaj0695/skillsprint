import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { DashboardLayout } from "../../components/Layout/DashboardLayout";
import { Job, JobCard } from "../../components/Job/JobCard";

export const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      setLoading(true);
      const ref = doc(db, "jobs", jobId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setJob({ id: snap.id, ...snap.data() } as Job);
      }
      setLoading(false);
    };
    fetchJob();
  }, [jobId]);

  if (loading)
    return (
      <div className="text-center py-12 text-gray-500">
        Loading job details...
      </div>
    );
  if (!job)
    return (
      <div className="text-center py-12 text-gray-500">Job not found.</div>
    );

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <button
          className="text-blue-600 hover:underline mb-2"
          onClick={() => navigate(-1)}
        >
          ← Back to Jobs
        </button>
        <JobCard job={job} showViewButton={false} />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Job Description
          </h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-6">
            Requirements & Qualifications
          </h2>
          <p className="text-gray-700 whitespace-pre-line">
            {job.requirements}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};
