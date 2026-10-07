# RoundCode

> **Learn. Practice. Grow.**  
> A production-grade platform designed for DSA mastery, interactive problem solving, and mentor-driven code review.

---

## 1. Overview

RoundCode provides a focused environment for mastering Data Structures & Algorithms with personalized code reviews. The core workflow is:

$$\text{Member Selects Problem} \longrightarrow \text{Writes Code in Monaco Editor} \longrightarrow \text{Submits Solution} \longrightarrow \text{Stored in MongoDB} \longrightarrow \text{Admin Reviews & Mentors} \longrightarrow \text{Member Iterates}$$

- **In-Browser Monaco Editor**: Write solutions in C++, Java, Python, and JavaScript with syntax highlighting and indentation.
- **Direct Submission to MongoDB**: Solutions are securely persisted in MongoDB Atlas without automated compilation or execution.
- **Faculty & Admin Mentorship**: Administrators review submitted code, assign review statuses, and leave detailed algorithmic critique.
- **Review Progress Tracking**:
  - `Pending Review`: Queued for mentor assessment.
  - `Under Review`: Currently being inspected by an admin.
  - `Approved`: Solution meets optimal algorithmic time/space targets.
  - `Needs Revision`: Mentor provided improvement notes for iteration.

---

## 2. Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS variables, `clsx`, `tailwind-merge`
- **UI & Icons**: shadcn/ui design patterns & [Lucide Icons](https://lucide.dev/)
- **Database & ODM**: MongoDB Atlas & [Mongoose](https://mongoosejs.com/)
- **Code Workspace**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) (`@monaco-editor/react`)
- **Authentication**: Secure HTTP-only cookies, signed JWTs with [`jose`](https://github.com/panva/jose), password hashing with `bcryptjs`

---

## 3. Directory Architecture

```text
├── app/                  # Next.js App Router (pages, layouts, route handlers)
│   ├── api/
│   │   ├── auth/         # Login, Register, Logout route handlers
│   │   └── submissions/  # Code submission & admin review APIs
│   ├── admin/
│   │   └── submissions/  # Admin code review console
│   ├── questions/
│   │   ├── [id]/         # Problem solving page with Monaco Editor
│   │   └── page.tsx      # Problem curriculum directory
│   ├── submissions/      # Member submission history & feedback
│   ├── dashboard/        # Member progress console
│   ├── resources/        # Curated DSA learning guides
│   ├── login/            # Sign in portal
│   ├── register/         # Direct member registration
│   ├── globals.css       # Dark-first developer design tokens
│   ├── layout.tsx        # Global layout with navigation & footer
│   └── page.tsx          # Homepage showcase
├── components/           # Reusable React components
│   ├── ui/               # Base primitives (Button, Card, Badge, Input)
│   └── layout/           # Shared layout (Navbar, Footer)
├── lib/                  # Server-side & shared utilities
│   ├── db/               # Cached Mongoose connection (mongodb.ts)
│   ├── auth/             # JWT cookies (session.ts) & bcrypt (password.ts)
│   └── data/             # Curated problem definitions (questions.ts)
├── models/               # Mongoose domain models
│   ├── User.ts           # User accounts & role schemas
│   ├── Question.ts       # DSA problem sets & starter code
│   └── Submission.ts     # Code submissions & admin review records
├── types/                # TypeScript interfaces & domain types
│   └── index.ts          # Core type definitions
├── .env.example          # Environment variable template
└── README.md             # Platform documentation
```

---

## 4. Local Development Setup

### Prerequisites
- **Node.js**: v18.18+ or v20+ (tested on Node v26)
- **MongoDB Atlas**: Connection URI

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/roundcode.git
   cd RTB
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```
   Set your MongoDB Atlas URI in `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/roundcode?retryWrites=true&w=majority
   AUTH_SECRET=generate-a-secure-32-byte-secret-key-here
   SESSION_COOKIE_NAME=roundcode_session
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Submission Review Statuses

| Status | Definition |
|---|---|
| **Pending Review** | Newly submitted code awaiting faculty review |
| **Under Review** | Actively being evaluated by a reviewer |
| **Approved** | Solution satisfies complexity and code quality targets |
| **Needs Revision** | Feedback provided; member is prompted to improve and resubmit |
