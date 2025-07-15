import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/Layout/DashboardLayout";
import { Target, ArrowRight, Clock, Star } from "lucide-react";
import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { backend_end_point } from "../../lib/helper";

export const CareerPath: React.FC = () => {
  const { currentUser } = useAuth();
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [generatedPath, setGeneratedPath] = useState<any>(null); // { title, description, skills }
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const questions = [
    {
      question: "What area of technology interests you most?",
      options: [
        "Frontend Development (User Interfaces)",
        "Backend Development (Server & Databases)",
        "Mobile App Development",
        "Artificial Intelligence & Machine Learning",
        "Data Science & Analytics",
        "Cybersecurity",
        "DevOps & Cloud",
      ],
    },
    {
      question: "What type of work environment do you prefer?",
      options: [
        "Collaborative team projects",
        "Independent problem-solving",
        "Fast-paced startup environment",
        "Structured corporate setting",
        "Remote/flexible work",
        "Research-focused environment",
      ],
    },
    {
      question: "Which of these activities sounds most appealing?",
      options: [
        "Designing beautiful user interfaces",
        "Solving complex algorithms",
        "Analyzing data patterns",
        "Protecting systems from threats",
        "Building scalable infrastructure",
        "Creating mobile experiences",
      ],
    },
  ];

  // Save quiz answers to Firestore
  const saveQuizAnswers = async (quizAnswers: string[]) => {
    if (!currentUser) return;
    await setDoc(
      doc(db, "users", currentUser.uid),
      { careerQuizAnswers: quizAnswers },
      { merge: true }
    );
  };

  // Load quiz answers from Firestore on mount
  useEffect(() => {
    if (!currentUser) return;
    const fetchQuiz = async () => {
      setLoading(true);
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : {};
      if (
        userData.careerQuizAnswers &&
        Array.isArray(userData.careerQuizAnswers) &&
        userData.careerQuizAnswers.length === questions.length
      ) {
        setAnswers(userData.careerQuizAnswers);
        // Fetch all courses from Firestore
        const coursesSnap = await getDocs(collection(db, "courses"));
        const allCourses = coursesSnap.docs.map((doc) => doc.data());
        let ids = userData.recommendedCourseIds || [];
        let title = userData.recommendedTitle || "";
        let description = userData.recommendedDescription || "";
        let skills = userData.recommendedSkills || [];
        if (!ids.length) {
          // Call backend API for recommendations if not cached
          const res = await fetch(`${backend_end_point}/recommend-courses`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              interests: userData.careerQuizAnswers,
              courses: allCourses.map(({ id, description }) => ({
                id,
                description,
              })),
            }),
          });
          const data = await res.json();
          ids = data.recommendedCourseIds || [];
          title = data.title || "Recommended Career Path";
          description = data.description || "";
          skills = data.skills || [];
          // Store in Firestore
          await setDoc(
            doc(db, "users", currentUser.uid),
            {
              recommendedCourseIds: ids,
              recommendedTitle: title,
              recommendedDescription: description,
              recommendedSkills: skills,
            },
            { merge: true }
          );
        }
        const filtered = allCourses.filter((c) => ids.includes(c.id));
        setRecommendedCourses(filtered);
        setGeneratedPath({
          title,
          description,
          skills,
        });
        setShowQuiz(false);
      } else {
        setShowQuiz(true);
      }
      setLoading(false);
    };
    fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed, save to Firestore and generate recommendations
      await saveQuizAnswers(newAnswers);
      setLoading(true);
      try {
        // Fetch all courses from Firestore
        const coursesSnap = await getDocs(collection(db, "courses"));
        const allCourses = coursesSnap.docs.map((doc) => doc.data());
        // Call backend API for recommendations
        const res = await fetch(`${backend_end_point}/recommend-courses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interests: newAnswers,
            courses: allCourses.map(({ id, description }) => ({
              id,
              description,
            })),
          }),
        });
        const data = await res.json();
        const ids = data.recommendedCourseIds || [];
        const filtered = allCourses.filter((c) => ids.includes(c.id));
        setRecommendedCourses(filtered);
        setGeneratedPath({
          title: data.title || "Recommended Career Path",
          description: data.description || "",
          skills: data.skills || [],
        });
        // Store in Firestore
        if (currentUser) {
          await setDoc(
            doc(db, "users", currentUser.uid),
            {
              recommendedCourseIds: ids,
              recommendedTitle: data.title || "Recommended Career Path",
              recommendedDescription: data.description || "",
              recommendedSkills: data.skills || [],
            },
            { merge: true }
          );
        }
        setShowQuiz(false);
      } catch (err) {
        setRecommendedCourses([]);
        setGeneratedPath({
          title: "Recommended Career Path",
          description: "",
          skills: [],
        });
        setShowQuiz(false);
      }
      setLoading(false);
    }
  };
  // Refresh recommended courses
  const handleRefreshRecommendations = async () => {
    setRefreshing(true);
    try {
      if (!currentUser) return;
      // Fetch all courses from Firestore
      const coursesSnap = await getDocs(collection(db, "courses"));
      const allCourses = coursesSnap.docs.map((doc) => doc.data());
      // Call backend API for recommendations
      const res = await fetch(`${backend_end_point}/recommend-courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: answers,
          courses: allCourses.map(({ id, description }) => ({
            id,
            description,
          })),
        }),
      });
      const data = await res.json();
      const ids = data.recommendedCourseIds || [];
      const filtered = allCourses.filter((c) => ids.includes(c.id));
      setRecommendedCourses(filtered);
      setGeneratedPath({
        title: data.title || "Recommended Career Path",
        description: data.description || "",
        skills: data.skills || [],
      });
      // Store in Firestore
      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          recommendedCourseIds: ids,
          recommendedTitle: data.title || "Recommended Career Path",
          recommendedDescription: data.description || "",
          recommendedSkills: data.skills || [],
        },
        { merge: true }
      );
    } catch (err) {
      // Optionally handle error
    }
    setRefreshing(false);
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const resetQuiz = async () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setGeneratedPath(null);
    if (currentUser) {
      await setDoc(
        doc(db, "users", currentUser.uid),
        { careerQuizAnswers: [] },
        { merge: true }
      );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96 text-gray-500 text-lg">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  if (showQuiz) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Career Interest Quiz
                </h2>
                <span className="text-sm text-gray-500">
                  {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestion + 1) / questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {questions[currentQuestion].question}
              </h3>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Career Path
            </h1>
            <p className="text-gray-600 mt-2">
              Discover and follow your personalized learning journey
            </p>
          </div>
          {!generatedPath && (
            <button
              onClick={startQuiz}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Target className="h-5 w-5" />
              <span>Take Career Quiz</span>
            </button>
          )}
        </div>

        {!generatedPath ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Discover Your Ideal Career Path
            </h3>
            <p className="text-gray-600 mb-6">
              Take our AI-powered career assessment to get personalized
              recommendations based on your interests, skills, and goals.
            </p>
            <button
              onClick={startQuiz}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Career Path Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {generatedPath.title}
                  </h2>
                  <p className="text-blue-100 mb-4">
                    {generatedPath.description}
                  </p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5" />
                      <span>
                        {generatedPath.skills.length} skills to master
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetQuiz}
                  className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            </div>

            {/* Skills Overview */}
            {generatedPath.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Skills You'll Master
                </h3>
                <div className="flex flex-wrap gap-2">
                  {generatedPath.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Recommended Courses */}
            {recommendedCourses.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recommended Courses for You
                  </h3>
                  <button
                    onClick={handleRefreshRecommendations}
                    disabled={refreshing}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {refreshing ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {recommendedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-md transition"
                    >
                      <div className="flex-1">
                        <h4 className="font-bold text-blue-700 mb-1">
                          {course.title}
                        </h4>
                        <p className="text-gray-700 mb-2">
                          {course.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Clock className="h-4 w-4 mr-1" /> {course.duration}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {course.tags &&
                            course.tags.map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                        <a
                          href={course.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          View Course
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
