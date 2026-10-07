# RoundTable

> **Learn. Practice. Grow.**  
> A private, production-grade technical society platform designed for DSA mastery, rigorous code evaluation, and member development.

---

## 1. Overview

RoundTable provides a closed, high-standard environment for university engineering societies. The core workflow is:

$$\text{Register} \longrightarrow \text{Admin Approval} \longrightarrow \text{Login} \longrightarrow \text{Learn} \longrightarrow \text{Practice} \longrightarrow \text{Submit Code} \longrightarrow \text{Track Progress}$$

- **Vetted Registry**: Access is gated behind mandatory administrator review (`pending`, `approved`, `rejected`, `suspended`).
- **In-Browser Code Execution**: Interactive Monaco Editor executing code across C++, Java, Python, and JavaScript powered by Judge0.
- **Structured Mentorship**: Submissions are tracked and reviewed by admins with line-level feedback.
- **Deep Analytics**: Real-time topic, difficulty, and acceptance rate progress indicators.

---

## 2. Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS variables, `clsx`, `tailwind-merge`
- **UI & Icons**: shadcn/ui design patterns & [Lucide Icons](https://lucide.dev/)
- **Database & ODM**: MongoDB Atlas & [Mongoose](https://mongoosejs.com/)
- **Authentication**: Secure HTTP-only cookies, signed JWTs with [`jose`](https://github.com/panva/jose), password hashing with `bcryptjs`
- **Code Execution**: [Judge0 API](https://judge0.com/) & [Monaco Editor](https://microsoft.github.io/monaco-editor/)

---

## 3. Directory Architecture

```text
├── app/                  # Next.js App Router (pages, layouts, route handlers)
│   ├── globals.css       # Dark-first developer design tokens
│   ├── layout.tsx        # Global layout with navigation & footer
│   ├── page.tsx          # Phase 1 Landing & Platform Showcase
│   └── not-found.tsx     # Custom 404 page
├── components/           # Reusable React components
│   ├── ui/               # Base primitives (Button, Card, Badge, Input)
│   ├── layout/           # Shared layout (Navbar, Footer)
│   ├── dashboard/        # Member dashboard components (Phase 4)
│   ├── questions/        # Problem list and editor components (Phase 5/6)
│   ├── submissions/      # Submission history components (Phase 7)
│   ├── resources/        # Curated links components (Phase 8)
│   └── admin/            # Admin console components (Phase 3)
├── lib/                  # Server-side & shared utilities
│   ├── db/               # Cached Mongoose connection (mongodb.ts)
│   ├── auth/             # JWT cookies (session.ts) & bcrypt (password.ts)
│   ├── judge0/           # Code execution client (Phase 6)
│   └── validations/      # Server-side Zod / schema validators (Phase 2+)
├── models/               # Mongoose domain models
│   ├── User.ts           # User model with roles, statuses, and indexes
│   ├── Question.ts       # DSA problem sets & test cases (Phase 5)
│   ├── Submission.ts     # Code submissions & evaluation records (Phase 6/7)
│   ├── Resource.ts       # Curated external resources (Phase 8)
│   └── Notification.ts   # System notifications (Phase 10)
├── types/                # TypeScript interfaces & domain types
│   └── index.ts          # Core type definitions
├── .env.example          # Environment variable template
└── README.md             # Platform documentation
```

---

## 4. Local Development Setup

### Prerequisites
- **Node.js**: v18.18+ or v20+ (tested on Node v26)
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster URI
- **npm** or preferred package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/roundtable.git
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
   Edit `.env.local` and provide your MongoDB Atlas connection string and authentication secret:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/roundtable?retryWrites=true&w=majority
   AUTH_SECRET=generate-a-secure-32-byte-secret-key-here
   SESSION_COOKIE_NAME=roundtable_session
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Security & Authentication Architecture

- **HTTP-Only Cookies**: Authentication tokens are stored inside strict, HTTP-only, SameSite cookies. Frontend scripts cannot access the session token.
- **Server-Side Authorization**: Every protected route, action, and route handler evaluates credentials on the server.
- **Bcrypt Hashing**: Passwords undergo salted bcrypt hashing (12 rounds) before persistence. Plaintext passwords are never stored or logged.
- **Role & State Enforcing**:
  - `member`, `admin`, `superadmin`
  - `pending`, `approved`, `rejected`, `suspended`

---

## 6. Implementation Roadmap

- [x] **Phase 1: Project Setup & Foundation**
  - Next.js 15, TypeScript, Tailwind CSS, shadcn design system
  - Dark-first aesthetic inspired by Linear, Raycast, GitHub
  - MongoDB Atlas connection with global serverless caching
  - User model with schema validation and query indexes
  - JWT session & password hashing foundation
  - Base layout, responsive navbar, footer, landing page
- [ ] **Phase 2: Authentication System**
- [ ] **Phase 3: Admin Approval Workflow**
- [ ] **Phase 4: Member Dashboard**
- [ ] **Phase 5: DSA Question System**
- [ ] **Phase 6: Coding System (Monaco + Judge0)**
- [ ] **Phase 7: Submission System**
- [ ] **Phase 8: Resource System**
- [ ] **Phase 9: Progress Tracking**
- [ ] **Phase 10: Notifications**
- [ ] **Phase 11: Security & Hardening**
- [ ] **Phase 12: Production Polish & Deployment**
