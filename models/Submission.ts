import mongoose, { Schema, Document, Model } from "mongoose";
import { SubmissionStatus } from "@/types";

export interface ISubmissionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  questionId: string;
  code: string;
  language: string;
  status: SubmissionStatus;
  adminFeedback?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmissionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    questionId: {
      type: String,
      required: [true, "Question ID is required"],
      index: true,
    },
    code: {
      type: String,
      required: [true, "Code content is required"],
    },
    language: {
      type: String,
      required: [true, "Programming language is required"],
      enum: ["cpp", "java", "python", "javascript"],
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["Pending Review", "Under Review", "Approved", "Needs Revision"],
      default: "Pending Review",
      index: true,
    },
    adminFeedback: {
      type: String,
      default: "",
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

SubmissionSchema.index({ userId: 1, questionId: 1, submittedAt: -1 });

export const Submission: Model<ISubmissionDocument> =
  mongoose.models.Submission ||
  mongoose.model<ISubmissionDocument>("Submission", SubmissionSchema);

export default Submission;
