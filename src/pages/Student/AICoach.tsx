import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { DashboardLayout } from "../../components/Layout/DashboardLayout";
import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { backend_end_point } from "../../lib/helper";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string; // ISO string for Firestore compatibility
}

export const AICoach: React.FC = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [loadingChats, setLoadingChats] = useState(true);

  const suggestedQuestions = [
    "How can I improve my resume for frontend developer roles?",
    "What skills should I learn to become a data scientist?",
    "How do I prepare for technical interviews?",
    "What's the current job market like for my field?",
    "How can I build a strong professional network?",
    "What certifications would boost my career prospects?",
  ];

  // Load chats from Firestore on mount
  useEffect(() => {
    if (!currentUser) return;
    const fetchChats = async () => {
      setLoadingChats(true);
      const docRef = doc(db, "ai_chats", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMessages(docSnap.data().messages || []);
      } else {
        // Add welcome message if no chat exists
        setMessages([
          {
            id: "1",
            content:
              "Hi! I'm your AI Career Coach powered by Gemini. I'm here to help you with career guidance, skill development, interview preparation, and any professional questions you might have. How can I assist you today?",
            sender: "ai",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
      setLoadingChats(false);
    };
    fetchChats();
  }, [currentUser]);

  // Save chats to Firestore
  const saveChats = async (updatedMessages: Message[]) => {
    if (!currentUser) return;
    await setDoc(doc(db, "ai_chats", currentUser.uid), {
      messages: updatedMessages,
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentUser) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);
    setStreamedText("");
    await saveChats(updatedMessages);

    // Call backend /chat API
    try {
      // Map messages to backend format
      const chatMessages = updatedMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        text: msg.content,
      }));
      const res = await fetch(`${backend_end_point}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatMessages }),
      });
      let aiText = "";
      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value);
            aiText += chunk;
            setStreamedText((prev) => prev + chunk);
            // Scroll to bottom as new text arrives
            setTimeout(() => {
              chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 0);
          }
        }
      }
      if (!aiText) aiText = "Sorry, I couldn't generate a response.";
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiText,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      const newMessages = [...updatedMessages, aiResponse];
      setMessages(newMessages);
      setStreamedText("");
      await saveChats(newMessages);
    } catch (err) {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, there was an error connecting to the AI Coach.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      const newMessages = [...updatedMessages, aiResponse];
      setMessages(newMessages);
      setStreamedText("");
      await saveChats(newMessages);
    }
    setIsLoading(false);
  };

  // Gemini handles AI response now

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  // Delete all chats
  const handleDeleteChats = async () => {
    if (!currentUser) return;
    await deleteDoc(doc(db, "ai_chats", currentUser.uid));
    setMessages([
      {
        id: "1",
        content:
          "Hi! I'm your AI Career Coach powered by Gemini. I'm here to help you with career guidance, skill development, interview preparation, and any professional questions you might have. How can I assist you today?",
        sender: "ai",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-200px)] flex flex-col">
        {/* Header */}
        <div className="relative flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Career Coach
            </h1>
            <p className="text-gray-600">
              Get personalized career guidance powered by Gemini AI
            </p>
          </div>
          <button
            onClick={handleDeleteChats}
            className="absolute right-0 top-0 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
            title="Delete all chats"
          >
            Delete All Chats
          </button>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loadingChats ? (
              <div className="text-center text-gray-500">Loading chats...</div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "ai"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {message.sender === "ai" ? (
                      <Bot className="h-5 w-5 text-white" />
                    ) : (
                      <User className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-2xl ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    } rounded-lg p-4`}
                  >
                    {message.sender === "ai" ? (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    ) : (
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                    )}
                    <div
                      className={`text-xs mt-2 ${
                        message.sender === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}

            {isLoading && streamedText && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-4 max-w-2xl">
                  <ReactMarkdown>{streamedText}</ReactMarkdown>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && !loadingChats && (
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Suggested questions:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your career..."
                className="flex-1 resize-none border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
