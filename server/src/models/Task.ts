import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  image: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  assignedTo: string; // User ID
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed', 'overdue'], 
    default: 'pending' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  assignedTo: { type: String, required: true },
  dueDate: { type: Date, required: true },
}, {
  timestamps: true
});

export default mongoose.model<ITask>('Task', TaskSchema);
