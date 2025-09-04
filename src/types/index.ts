export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  progress: number;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  avatar: string;
  isOnline: boolean;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  inProgress: number;
}