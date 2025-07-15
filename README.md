# SkillSprint

SkillSprint is a modern web application designed to connect students and recruiters, streamline job searches, and provide AI-powered career coaching. Built with React, TypeScript, Vite, and Firebase, SkillSprint offers a seamless experience for both job seekers and recruiters.

## Features

- **Student Dashboard:** Personalized dashboard for students to manage their job search and career path.
- **Recruiter Dashboard:** Tools for recruiters to post jobs and manage applicants.
- **Job Search:** Advanced job search functionality with filtering and detailed job views.
- **AI Coach:** AI-powered career advice and resume building assistance.
- **Authentication:** Secure login and signup for both students and recruiters.
- **Protected Routes:** Role-based access control for different user types.

## Technologies Used

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)

## Project Structure

```
src/
  components/      # Reusable UI components
  contexts/        # React context providers (e.g., Auth)
  lib/             # Utility libraries (e.g., firebase config)
  pages/           # Main application pages (Student, Recruiter, Auth, etc.)
  types/           # TypeScript type definitions
  assets/          # Static assets (images, logos)
```

## Getting Started

### Prerequisites

- Node.js (v18 or above recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pankaj0695/skillsprint.git
   cd skillsprint/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Add your Firebase config to `src/lib/firebase.ts`

### Running the App

```bash
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run preview` — Preview the production build

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License

This project is licensed under the MIT License.
