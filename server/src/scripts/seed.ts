import 'dotenv/config';
import mongoose from 'mongoose';
import Task from '../models/Task';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const sampleTasks = [
  {
    title: "API Documentation",
    description: "Create comprehensive API documentation for the new microservices architecture. Include endpoint descriptions, request/response examples, authentication methods, and error handling.",
    image: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    status: "in-progress",
    priority: "high",
    progress: 65,
    assignedTo: "student1",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  {
    title: "Database Schema Design",
    description: "Design and implement the database schema for the user management system. Ensure proper indexing, relationships, and data validation.",
    image: "https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    status: "pending",
    priority: "medium",
    progress: 0,
    assignedTo: "student2",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
  },
  {
    title: "Frontend Component Library",
    description: "Build a reusable component library with React components including buttons, forms, modals, and navigation elements.",
    image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    status: "completed",
    priority: "high",
    progress: 100,
    assignedTo: "student1",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    title: "Testing Strategy Implementation",
    description: "Implement comprehensive testing strategy including unit tests, integration tests, and end-to-end tests for the application.",
    image: "https://images.pexels.com/photos/1181346/pexels-photo-1181346.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    status: "in-progress",
    priority: "medium",
    progress: 30,
    assignedTo: "student3",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
  },
  {
    title: "Security Audit",
    description: "Conduct a comprehensive security audit of the application including vulnerability assessment, penetration testing, and security best practices review.",
    image: "https://images.pexels.com/photos/1181466/pexels-photo-1181466.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    status: "pending",
    priority: "high",
    progress: 0,
    assignedTo: "student2",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
  }
];

const sampleUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "student",
    avatar: "https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "mentor",
    avatar: "https://images.pexels.com/photos/1181392/pexels-photo-1181392.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    name: "Mike Johnson",
    email: "mike@example.com",
    password: "password123",
    role: "student",
    avatar: "https://images.pexels.com/photos/1181393/pexels-photo-1181393.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  }
];

async function seedDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Taskmanager';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Task.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      users.push(user);
      console.log(`Created user: ${user.name}`);
    }

    // Create tasks with real user IDs
    const student1 = users.find(u => u.email === 'john@example.com');
    const student2 = users.find(u => u.email === 'mike@example.com');
    const student3 = users.find(u => u.email === 'jane@example.com'); // Using mentor as student3 for demo

    const tasksWithUserIds = sampleTasks.map(task => ({
      ...task,
      assignedTo: task.assignedTo === 'student1' ? student1!._id.toString() :
                  task.assignedTo === 'student2' ? student2!._id.toString() :
                  student3!._id.toString()
    }));

    for (const taskData of tasksWithUserIds) {
      const task = new Task(taskData);
      await task.save();
      console.log(`Created task: ${task.title}`);
    }

    console.log('Database seeded successfully!');
    console.log('\nTest users:');
    console.log('Student: john@example.com / password123');
    console.log('Mentor: jane@example.com / password123');
    console.log('Student: mike@example.com / password123');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedDatabase();
