export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "recruiter";
  profileImage?: string;
  createdAt: Date;
}

export interface Student extends User {
  role: "student";
  careerTrack?: string;
  skills: string[];
  interests: string[];
  careerQuizAnswers: string[];
  recommendedCourseIds: number[];
  recommendedDescription: string;
  recommendedSkills: string[];
  recommendedTitle: string;
  education?: string;
  experience?: string;
  resumeUrl?: string;
  bookmarkedJobs: string[];
  completedModules: string[];
}

export interface Recruiter extends User {
  role: "recruiter";
  company: string;
  position?: string;
  postedJobs: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  skillsRequired: string[];
  type: "internship" | "full-time" | "part-time" | "contract";
  location: string;
  remote: boolean;
  salary?: string;
  recruiterId: string;
  createdAt: Date;
  applicants: string[];
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  skills: string[];
  roadmap: RoadmapItem[];
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  resources: string[];
  completed?: boolean;
}
