import mongoose, { Schema, Document, Model } from "mongoose";
import { ResourceType, QuestionTopic } from "@/types";

export interface IResourceDocument extends Document {
  title: string;
  description: string;
  type: ResourceType;
  topic: QuestionTopic;
  url: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResourceDocument>(
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
    type: {
      type: String,
      enum: ["youtube", "video", "leetcode", "pdf", "article", "other"],
      default: "youtube",
      index: true,
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      index: true,
    },
    url: {
      type: String,
      required: [true, "Resource URL is required"],
      trim: true,
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

export const Resource: Model<IResourceDocument> =
  mongoose.models.Resource ||
  mongoose.model<IResourceDocument>("Resource", ResourceSchema);

export default Resource;
