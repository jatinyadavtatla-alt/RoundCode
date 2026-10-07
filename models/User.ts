import mongoose, { Schema, Document, Model } from "mongoose";
import { UserRole, UserStatus } from "@/types";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  phone: string;
  collegeId: string;
  branch: string;
  year: number;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
      index: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    collegeId: {
      type: String,
      required: [true, "College/Student ID is required"],
      trim: true,
      uppercase: true,
      index: true,
    },
    branch: {
      type: String,
      required: [true, "Branch/Department is required"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Academic year is required"],
      min: [1, "Year must be at least 1"],
      max: [5, "Year cannot exceed 5"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    role: {
      type: String,
      enum: ["member", "admin", "superadmin"],
      default: "member",
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound or secondary indexes for high-throughput administrative queries
UserSchema.index({ status: 1, role: 1 });
UserSchema.index({ createdAt: -1 });

export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;
