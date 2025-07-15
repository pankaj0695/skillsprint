import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";

// Pages
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Auth/Login";
import { Signup } from "./pages/Auth/Signup";
import GetStarted from "./pages/GetStarted";
import { StudentDashboard } from "./pages/Student/Dashboard";
import { CareerPath } from "./pages/Student/CareerPath";
import { ResumeBuilder } from "./pages/Student/ResumeBuilder";
import { JobSearch } from "./pages/Student/JobSearch";
import { AICoach } from "./pages/Student/AICoach";
import { RecruiterDashboard } from "./pages/Recruiter/Dashboard";
import { PostJob } from "./pages/Recruiter/PostJob";
import { RecruiterJobs } from "./pages/Recruiter/Jobs";
import { JobDetails } from "./pages/JobDetails/JobDetails";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/career-path"
            element={
              <ProtectedRoute requiredRole="student">
                <CareerPath />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/resume"
            element={
              <ProtectedRoute requiredRole="student">
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/jobs"
            element={
              <ProtectedRoute requiredRole="student">
                <JobSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/coach"
            element={
              <ProtectedRoute requiredRole="student">
                <AICoach />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/post-job"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute requiredRole="recruiter">
                <RecruiterJobs />
              </ProtectedRoute>
            }
          />
          <Route path="/jobs/:jobId" element={<JobDetails />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
