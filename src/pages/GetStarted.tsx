import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GetStarted: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") || "login";

  const handleRoleSelect = (role: "student" | "recruiter") => {
    navigate({
      pathname: `/${next}`,
      search: `?role=${role}`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Get Started</h2>
        <p className="mb-8 text-gray-600">Choose your role to continue</p>
        <div className="grid grid-cols-2 gap-6">
          <button
            className="p-6 border-2 border-blue-600 rounded-lg bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition-colors"
            onClick={() => handleRoleSelect("student")}
          >
            <div className="text-4xl mb-2">🎓</div>
            Student
          </button>
          <button
            className="p-6 border-2 border-emerald-600 rounded-lg bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors"
            onClick={() => handleRoleSelect("recruiter")}
          >
            <div className="text-4xl mb-2">💼</div>
            Recruiter
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
