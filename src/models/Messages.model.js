import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  content: {
    type: String,
    default: null
  },

  mediaUrl: {
    type: String,
    default: null
  },

  type: {
    type: String,
    enum: ["text", "image", "video", "audio"],
    default: "text"
  },

  seenBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]

}, { timestamps: true });

export default mongoose.model("Message", MessageSchema);
