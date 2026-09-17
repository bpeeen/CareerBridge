# Rural Job & Scheme Matching Platform

This is a full-stack application built with **React**, **Vite**, **Express**, **Tailwind CSS**, and **TypeScript**. It utilizes a unified matching engine to serve localized employment opportunities and government schemes.

---

## 🚀 How to Run Locally in VS Code

Follow these simple steps to install and run the application on your computer:

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher is recommended).

### Step 1: Open the Project in VS Code

1. Open **Visual Studio Code**.
2. Click on `File` > `Open Folder...` (or `Open...` on macOS).
3. Select the folder containing this project.

### Step 2: Configure Environment Variables

1. In the file explorer, duplicate `.env.example` and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in any necessary API keys (e.g., your `GEMINI_API_KEY`, if applicable).

### Step 3: Install Dependencies

Open the integrated terminal in VS Code (`Ctrl + ` ` ` or `View` > `Terminal`) and run:
```bash
npm install
```

### Step 4: Run the Development Server

Start the full-stack server (runs Express and integrates Vite dynamically) by running:
```bash
npm run dev
```

The application will be running at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🛠️ Workspace Architecture & Scripts

### Available Scripts

*   `npm run dev`: Starts the combined Express backend and Vite frontend development server via `tsx`.
*   `npm run build`: Bundles the React frontend into static assets and compiles the Express server into a standalone production file (`dist/server.cjs`).
*   `npm run start`: Runs the compiled production-ready application locally.
*   `npm run lint`: Runs Typechecking over the entire codebase to detect static errors.

### Project Structure

*   `src/`: React frontend source code (components, context, state management).
*   `server.ts` & `server/`: Express backend code handling API routes and AI services.
*   `vite.config.ts`: Vite compilation and module configuration.
*   `package.json`: Main project configuration, scripts, and dependencies.
