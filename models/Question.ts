import mongoose, { Schema, Document, Model } from "mongoose";
import { QuestionDifficulty, QuestionTopic } from "@/types";

export interface IQuestionDocument extends Document {
  title: string;
  description: string;
  topic: QuestionTopic;
  difficulty: QuestionDifficulty;
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  starterCode: {
    cpp: string;
    java: string;
    python: string;
    javascript: string;
  };
  expectedComplexity?: {
    time?: string;
    space?: string;
  };
  leetcodeUrl?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestionDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: [true, "Difficulty is required"],
      index: true,
    },
    constraints: {
      type: [String],
      default: [],
    },
    examples: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String, default: "" },
      },
    ],
    starterCode: {
      cpp: { type: String, default: "" },
      java: { type: String, default: "" },
      python: { type: String, default: "" },
      javascript: { type: String, default: "" },
    },
    expectedComplexity: {
      time: { type: String, default: "" },
      space: { type: String, default: "" },
    },
    leetcodeUrl: {
      type: String,
      default: "",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Question: Model<IQuestionDocument> =
  mongoose.models.Question ||
  mongoose.model<IQuestionDocument>("Question", QuestionSchema);

export default Question;
