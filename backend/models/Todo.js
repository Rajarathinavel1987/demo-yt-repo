import mongoose from 'mongoose';

// A schema describes the shape of a document in a MongoDB collection.
const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

export default mongoose.model('Todo', todoSchema);
