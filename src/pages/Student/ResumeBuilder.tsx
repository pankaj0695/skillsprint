import React, { useState } from "react";
// Simple spinner component
const Spinner = () => (
  <div className="flex justify-center items-center py-8">
    <svg
      className="animate-spin h-8 w-8 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  </div>
);
import ReactMarkdown from "react-markdown";
import { DashboardLayout } from "../../components/Layout/DashboardLayout";
import { Upload, Sparkles } from "lucide-react";
import { backend_end_point } from "../../lib/helper";

export const ResumeBuilder: React.FC = () => {
  const [resumeText, setResumeText] = useState("");
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");

  // TODO: Replace with actual user interests from quiz context or props
  const userInterests = ["React", "Backend", "AI", "Node.js"];

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileUploading(true);
    setResumeUrl(null);
    setResumeText("");
    setFeedback("");
    // Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "SkillSprint"); // <-- Replace with your preset
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dnfkcjujc/auto/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setResumeUrl(data.secure_url);
      } else {
        alert("Failed to upload file to Cloudinary.");
      }
    } catch (err) {
      alert("Error uploading file.");
    }
    setFileUploading(false);
  };

  const analyzeResume = async () => {
    setIsAnalyzing(true);
    setFeedback("");
    try {
      const body: any = { interests: userInterests };
      if (resumeUrl) {
        body.resumeUrl = resumeUrl;
      } else if (resumeText) {
        body.resumeText = resumeText;
      } else {
        alert("Please upload a resume or paste text.");
        setIsAnalyzing(false);
        return;
      }
      if (jobDescription && jobDescription.trim().length > 0) {
        body.jobDescription = jobDescription;
      }
      console.log("Analyzing resume with body:", body);
      const res = await fetch(`${backend_end_point}/resume-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.feedback) {
        setFeedback(data.feedback);
      } else {
        setFeedback("No feedback received.");
      }
    } catch (err) {
      setFeedback("Error analyzing resume.");
    }
    setIsAnalyzing(false);
  };

  const sampleResumeText = `John Doe
Software Developer

Contact:
Email: john.doe@email.com
Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johndoe
GitHub: github.com/johndoe

Professional Summary:
Passionate full-stack developer with 3+ years of experience building scalable web applications. Proficient in React, Node.js, and modern JavaScript frameworks. Strong problem-solving skills and experience working in agile development environments.

Experience:
Frontend Developer | TechCorp Inc. | 2022 - Present
• Developed responsive web applications using React and TypeScript
• Collaborated with UX/UI designers to implement pixel-perfect designs
• Improved application performance by 40% through code optimization
• Mentored 2 junior developers and conducted code reviews

Junior Developer | StartupXYZ | 2021 - 2022
• Built RESTful APIs using Node.js and Express
• Implemented database schemas with MongoDB
• Participated in agile development processes and daily standups
• Contributed to open-source projects and team documentation

Education:
Bachelor of Computer Science | University of Technology | 2021
Relevant Coursework: Data Structures, Algorithms, Software Engineering

Skills:
• Frontend: React, JavaScript, TypeScript, HTML/CSS, Tailwind CSS
• Backend: Node.js, Express, MongoDB, PostgreSQL
• Tools: Git, Docker, AWS, Jest, Webpack
• Soft Skills: Problem Solving, Team Collaboration, Communication`;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
            <p className="text-gray-600 mt-2">
              Create and optimize your resume with AI-powered suggestions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resume Input */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upload or Edit Resume
              </h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  {/* PDF Preview */}
                  {resumeUrl && resumeUrl.endsWith(".pdf") && (
                    <div className="my-4">
                      <div className="text-sm text-gray-600 mb-2 text-left">
                        PDF Preview:
                      </div>
                      <div className="border rounded-lg overflow-hidden shadow-sm">
                        <embed
                          src={resumeUrl}
                          type="application/pdf"
                          width="100%"
                          height="400px"
                          className="w-full"
                        />
                      </div>
                      <button
                        className="mt-2 text-red-600 text-xs underline hover:text-red-800"
                        onClick={() => {
                          setResumeUrl(null);
                          setFeedback("");
                        }}
                      >
                        Remove PDF
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    disabled={fileUploading}
                  />
                  <label
                    htmlFor="resume-upload"
                    className={`cursor-pointer ${
                      fileUploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      {fileUploading
                        ? "Uploading..."
                        : "Click to upload your resume"}
                    </p>
                    <p className="text-sm text-gray-500">Supports PDF</p>
                  </label>
                  {resumeUrl && (
                    <div className="mt-2 text-green-600 text-sm">
                      File uploaded successfully!
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <span className="text-gray-500">or</span>
                </div>
                <button
                  onClick={() => {
                    setResumeText(sampleResumeText);
                    setResumeUrl(null);
                    setFeedback("");
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Use Sample Resume
                </button>
                <textarea
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value);
                    setResumeUrl(null);
                    setFeedback("");
                  }}
                  placeholder="Paste or type your resume content here..."
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Job Description + Analysis Results */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Job Description (optional)
              </h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here (optional)"
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              />
            </div>
            <button
              onClick={analyzeResume}
              disabled={isAnalyzing || (!resumeText && !resumeUrl)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
            >
              <Sparkles className="h-5 w-5" />
              <span>{isAnalyzing ? "Analyzing..." : "Analyze with AI"}</span>
            </button>
            {/* Analysis Results */}
            {isAnalyzing ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[200px]">
                <Spinner />
                <div className="mt-4 text-blue-700 font-medium">
                  Analyzing your resume with AI...
                </div>
              </div>
            ) : feedback ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-yellow-600" />
                  <span>AI Feedback</span>
                </h3>
                <div className="prose max-w-none">
                  <ReactMarkdown>{feedback}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI-Powered Resume Analysis
                </h3>
                <p className="text-gray-600">
                  Upload or paste your resume content to get personalized
                  suggestions and skill extraction powered by AI.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
