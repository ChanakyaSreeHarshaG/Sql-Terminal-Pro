# ⚡ SQL Terminal Pro — In-Browser SQL Practice Platform

A full-featured, zero-backend, interactive SQL interview and practice terminal running **100% in the browser** powered by **SQLite in WebAssembly (WASM)**.

---

## ✨ Features

- **🚀 272 Hands-On SQL Challenges**:
  - **Standard Track (72 Questions)**: Complete curriculum covering Healthcare (Hospital Patient DB) and Enterprise (Northwind DB) relational schemas across Easy, Medium, and Hard tiers.
  - **20 Master Interview Patterns Track (200 Questions)**: 10 scenario-based questions for every high-frequency pattern (Top N per group, Gaps & Islands, Self-joins, Retention/Cohorts, Moving Averages, Fan-out traps, etc.).
- **⚡ Client-Side WebAssembly SQLite**:
  - Zero latency.
  - All SQL queries execute locally in your browser memory.
  - No server, API keys, or remote database connection required.
- **🔍 Dynamic Question-Specific Schema Explorer**:
  - Automatically identifies and expands only the table(s) relevant to the active question.
  - Allows previewing table data with 1-click without failing question checks.
- **💡 "Clue" & "Show Solution" Drawers**:
  - Targeted algorithmic hints without spoiling the query.
  - Official formatted solution query with 1-click copy or load into terminal.
- **🔢 Interactive Question Navigator**:
  - Grid & List view of all questions with difficulty indicators and checkmarks for solved problems.
  - Instant jump search bar.
  - Auto-scrolls to the current question.
- **💾 Automatic Progress Persistence**:
  - Solved question states persist in `localStorage`.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🌐 1-Click Deployment (Zero Errors)

Because this app is completely client-side and has no backend dependencies, it can be deployed for **free** on any static or serverless host:

### Option A: Vercel (Recommended)
1. Push this folder to a new GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of SQL Terminal Pro"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your repository and click **Deploy**. Vercel will automatically build and publish your site with a free `.vercel.app` domain.

### Option B: Netlify
1. Go to [netlify.com](https://netlify.com).
2. Connect your GitHub repository.
3. Keep default settings (`npm run build` and `.next`) and click **Deploy**.

---

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx         # Root layout with meta tags & Dark theme
│   ├── globals.css        # Tailwind styling & dark theme variables
│   └── page.tsx           # Standalone SQL Terminal application
├── components/
│   └── sql-practice/
│       ├── SqlEditor.tsx          # Code editor with shortcuts (Ctrl+Enter)
│       ├── QuestionCard.tsx       # Clue, Solution, and difficulty drawer
│       ├── QuestionNavigator.tsx  # Interactive numbered questions grid & search
│       ├── ResultsTable.tsx       # Results data grid & validation message
│       └── SchemaExplorer.tsx     # Dynamic question-specific schema tree
├── data/
│   ├── sqlPracticeData.ts         # Databases & Unified question models
│   └── sqlPractice/
│       ├── hospitalQuestions.ts   # 52 Healthcare SQL challenges
│       ├── northwindQuestions.ts  # 20 Enterprise SQL challenges
│       ├── patternQuestions.ts    # 200 Core interview pattern challenges
│       └── patternsData.ts        # DDL seeds & complete schema definitions
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📄 License
MIT — Free to use, modify, and deploy.
