export type UserRole = "member" | "admin" | "superadmin";

export type UserStatus = "pending" | "approved" | "rejected" | "suspended";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  collegeId: string;
  branch: string;
  year: number;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type SafeUser = Omit<IUser, "passwordHash">;

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  iat?: number;
  exp?: number;
}

export type QuestionType = "coding" | "external";
export type QuestionDifficulty = "Easy" | "Medium" | "Hard";

export type QuestionTopic =
  | "Arrays"
  | "Strings"
  | "Linked List"
  | "Stack"
  | "Queue"
  | "Binary Search"
  | "Trees"
  | "BST"
  | "Heap"
  | "Graphs"
  | "Greedy"
  | "Backtracking"
  | "Dynamic Programming"
  | "Recursion"
  | "Sorting"
  | "Searching"
  | "Bit Manipulation"
  | (string & {});

export interface IExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ITestCase {
  input: string;
  output: string;
  isHidden?: boolean;
}

export interface IQuestion {
  _id: string;
  title: string;
  description: string;
  topic: QuestionTopic;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  constraints?: string[];
  examples?: IExample[];
  starterCode?: Record<string, string>; // e.g. { cpp: "...", python: "...", java: "...", javascript: "..." }
  expectedComplexity?: {
    time?: string;
    space?: string;
  };
  testCases?: ITestCase[];
  leetcodeUrl?: string;
  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type SubmissionStatus =
  | "Pending Review"
  | "Under Review"
  | "Approved"
  | "Needs Revision";

export interface ISubmission {
  _id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  questionId: string;
  questionTitle?: string;
  code: string;
  language: string;
  status: SubmissionStatus;
  adminFeedback?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: Date | string;
  submittedAt: Date | string;
  updatedAt?: Date | string;
}

export type ResourceType = "youtube" | "video" | "leetcode" | "pdf" | "article" | "other";

export interface IResource {
  _id: string;
  title: string;
  description: string;
  type: ResourceType;
  topic: QuestionTopic;
  url: string;
  createdBy: string;
  createdAt: Date | string;
}

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date | string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
