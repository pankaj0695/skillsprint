import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Brain, Eye, EyeOff } from "lucide-react";
import { auth, googleProvider, db } from "../../lib/firebase";

export const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedRole =
    (searchParams.get("role") as "student" | "recruiter") || "student";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error when user starts typing
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const redirectPath =
          userData.role === "student" ? "/student/career-path" : "/recruiter";
        navigate(redirectPath);
      } else {
        // User doesn't exist in Firestore, redirect to signup
        navigate("/signup");
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      setError(
        error.message || "Failed to sign in. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      let result;
      try {
        // Try popup first
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupError: any) {
        // If popup is blocked, fall back to redirect
        if (
          popupError.code === "auth/popup-blocked" ||
          popupError.code === "auth/popup-closed-by-user"
        ) {
          await signInWithRedirect(auth, googleProvider);
          return; // Function will exit here as redirect happens
        } else {
          throw popupError; // Re-throw other errors
        }
      }

      // Check if user already exists with a different role
      const user: any = result.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      let existingData: any = {};
      if (userDoc.exists()) {
        existingData = userDoc.data();
        if (existingData.role !== selectedRole) {
          setError(
            `You have already signed up as a ${existingData.role}. You cannot sign in as a different role with the same account.`
          );
          return;
        }
      }

      // Create/update user profile in Firestore with selected role
      const userData = {
        id: user.uid,
        email: user.email!,
        name: user.displayName || "",
        role: selectedRole,
        profileImage: user.photoURL || null,
        createdAt: new Date(),
        ...(selectedRole === "student"
          ? {
              skills: [],
              interests: [],
              bookmarkedJobs: [],
              completedModules: [],
              careerQuizAnswers: existingData.careerQuizAnswers || [],
              recommendedCourseIds: existingData.recommendedCourseIds || [],
              recommendedDescription: existingData.recommendedDescription || "",
              recommendedSkills: existingData.recommendedSkills || [],
              recommendedTitle: existingData.recommendedTitle || "",
            }
          : { company: "", postedJobs: [] }),
      };
      await setDoc(doc(db, "users", user.uid), userData);
      const redirectPath =
        selectedRole === "student" ? "/student/career-path" : "/recruiter";
      navigate(redirectPath);
    } catch (error: any) {
      console.error("Error signing in:", error);
      setError(error.message || "Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Brain className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {selectedRole === "student" ? "Student Login" : "Recruiter Login"}
          </h2>
          <p className="mt-2 text-gray-600">
            {selectedRole === "student"
              ? "Sign in to your SkillSprint student account"
              : "Sign in to your SkillSprint recruiter account"}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="mt-4 w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to={`/signup?role=${selectedRole}`}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
