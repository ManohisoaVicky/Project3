import mongoose from "mongoose";
import { tagSchema, commentSchema } from "./user";

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    image: { data: Buffer, contentType: String },
    tags: [tagSchema],
    comments: [commentSchema],
    //18 and 19 need double checking
    author: { type: mongoose.Schema.ObjectId, ref: "userSchema" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Blog", blogSchema);
