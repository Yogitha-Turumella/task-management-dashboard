import { Task, Mentor } from '../types';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design System Implementation',
    description: 'Create a comprehensive design system with reusable components for the new product interface.',
    status: 'in-progress',
    dueDate: '2025-01-25',
    priority: 'high',
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-01-15',
    updatedAt: '2025-01-20',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    progress: 65
  },
  {
    id: '2',
    title: 'API Documentation',
    description: 'Document all REST API endpoints with examples and response formats.',
    status: 'pending',
    dueDate: '2025-01-30',
    priority: 'medium',
    assignedTo: 'Mike Chen',
    createdAt: '2025-01-16',
    updatedAt: '2025-01-16',
    image: 'https://images.pexels.com/photos/3182770/pexels-photo-3182770.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    progress: 0
  },
  {
    id: '3',
    title: 'Database Migration',
    description: 'Migrate user data from legacy system to new MongoDB Atlas cluster.',
    status: 'completed',
    dueDate: '2025-01-18',
    priority: 'high',
    assignedTo: 'Alex Rodriguez',
    createdAt: '2025-01-10',
    updatedAt: '2025-01-18',
    image: 'https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    progress: 100
  },
  {
    id: '4',
    title: 'Mobile App Testing',
    description: 'Comprehensive testing of mobile application across different devices and OS versions.',
    status: 'overdue',
    dueDate: '2025-01-15',
    priority: 'high',
    assignedTo: 'Emily Davis',
    createdAt: '2025-01-08',
    updatedAt: '2025-01-15',
    image: 'https://images.pexels.com/photos/4145191/pexels-photo-4145191.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    progress: 45
  },
  {
    id: '5',
    title: 'User Onboarding Flow',
    description: 'Design and implement improved user onboarding experience with interactive tutorials.',
    status: 'pending',
    dueDate: '2025-02-05',
    priority: 'medium',
    assignedTo: 'David Wilson',
    createdAt: '2025-01-18',
    updatedAt: '2025-01-18',
    image: 'https://images.pexels.com/photos/3184643/pexels-photo-3184643.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    progress: 0
  }
];

export const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Senior Frontend Developer',
    expertise: ['React', 'TypeScript', 'UI/UX'],
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: true
  },
  {
    id: '2',
    name: 'Mike Chen',
    role: 'Backend Engineer',
    expertise: ['Node.js', 'MongoDB', 'API Design'],
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: true
  },
  {
    id: '3',
    name: 'Alex Rodriguez',
    role: 'DevOps Specialist',
    expertise: ['AWS', 'Docker', 'CI/CD'],
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: false
  },
  {
    id: '4',
    name: 'Emily Davis',
    role: 'QA Engineer',
    expertise: ['Testing', 'Automation', 'Quality Assurance'],
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: true
  },
  {
    id: '5',
    name: 'David Wilson',
    role: 'Product Manager',
    expertise: ['Strategy', 'Analytics', 'User Research'],
    avatar: 'https://images.pexels.com/photos/1181267/pexels-photo-1181267.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: false
  }
]; 
