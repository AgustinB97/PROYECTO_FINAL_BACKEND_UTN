import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({

  name: {
    type: String,
    default: null
  },

  isGroup: {
    type: Boolean,
    default: false
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ],

  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  last_message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: null
  },

  avatar: {
    type: String,
    default: null
  },

  description: {
    type: String,
    default: ""
  }

}, { timestamps: true });


// 🟦 VIRTUAL: determina si es un chat privado sin guardar en DB
ChatSchema.virtual("isPrivate").get(function () {
  return !this.isGroup && this.members.length === 2;
});

// 🟦 Índices optimizados
ChatSchema.index({ members: 1 });

export default mongoose.model("Chat", ChatSchema);
