import React from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Users,
  FileText,
  Search,
  MessageCircle,
  Zap,
} from "lucide-react";
import { Header } from "../components/Layout/Header";

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Career Planning &
            <span className="text-blue-600 block">Job Matchmaking</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover your perfect career path with personalized AI guidance,
            build standout resumes, and connect with opportunities that match
            your skills and aspirations.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/login?role=student"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start as Student
            </Link>
            <Link
              to="/login?role=recruiter"
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Join as Recruiter
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for Career Success
          </h2>
          <p className="text-lg text-gray-600">
            Powered by cutting-edge AI technology and Google services
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI Career Coach
            </h3>
            <p className="text-gray-600">
              Get personalized career guidance and answers to your professional
              questions with our Gemini-powered AI coach.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Smart Resume Builder
            </h3>
            <p className="text-gray-600">
              Build professional resumes with AI-powered suggestions and skill
              extraction from your uploaded documents.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Job Matching
            </h3>
            <p className="text-gray-600">
              Find the perfect job opportunities that match your skills,
              interests, and career goals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Personalized Learning
            </h3>
            <p className="text-gray-600">
              Get customized learning paths and skill development roadmaps based
              on your career aspirations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Talent Matching
            </h3>
            <p className="text-gray-600">
              For recruiters: Post jobs and find qualified candidates with
              AI-powered talent matching.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Career Analytics
            </h3>
            <p className="text-gray-600">
              Track your progress and get insights into market trends and skill
              demand in your field.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Sprint Towards Your Dream Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and recruiters already using SkillSprint
            to build successful careers.
          </p>
          <Link
            to="/get-started?next=login"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Brain className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold">SkillSprint</span>
          </div>
          <p className="text-center text-gray-400">
            © 2025 SkillSprint. Powered by AI and built for the future of work.
          </p>
        </div>
      </footer>
    </div>
  );
};
