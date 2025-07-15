export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  remote: boolean;
  salary: string;
  description: string;
  requirements: string;
  skillsRequired: string[];
  recruiterId: string;
  createdAt?: any;
}

export const JobCard: React.FC<{
  job: Job;
  onViewDetails?: (job: Job) => void;
  showViewButton?: boolean;
}> = ({ job, onViewDetails, showViewButton = true }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
      {showViewButton && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => onViewDetails && onViewDetails(job)}
        >
          View Details
        </button>
      )}
    </div>
    <div className="text-gray-700 font-medium">{job.company}</div>
    <div className="text-gray-500 text-sm">
      {job.location} • {job.type} {job.remote && "• Remote"}
    </div>
    <div className="text-gray-500 text-sm">{job.salary}</div>
    <div className="flex flex-wrap gap-2 mt-2">
      {job.skillsRequired.map((skill, idx) => (
        <span
          key={idx}
          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
);
