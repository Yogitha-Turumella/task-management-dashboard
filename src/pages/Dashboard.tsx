import React, { useMemo, useState, useEffect } from 'react';
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Calendar as CalendarIcon, HelpCircle, Activity } from 'lucide-react';
import { Task, Mentor } from '../types';
import { api } from '../services/api';
import TaskDetail from '../components/Tasks/TaskDetail';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedTasks, fetchedMentors] = await Promise.all([
        api.getAllTasks(),
        api.getAllMentors()
      ]);
      setTasks(fetchedTasks);
      setMentors(fetchedMentors);
    };
    fetchData();

    // Listen for task updates coming from detail modal submission
    const onTaskUpdated = (e: any) => {
      const { id, updates } = e.detail || {};
      if (!id) return;
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    };
    window.addEventListener('task-updated', onTaskUpdated);
    return () => window.removeEventListener('task-updated', onTaskUpdated);
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const closeTaskDetail = () => {
    setIsTaskDetailOpen(false);
    setSelectedTask(null);
  };

  const getStatusCount = (status: Task['status']) => {
    return tasks.filter(task => task.status === status).length;
  };


  const getTotalProgress = () => {
    if (tasks.length === 0) return 0;
    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / tasks.length);
  };

  const recentTasks = tasks.slice(0, 5);
  // Dashboard keeps its UI simple; global search is in header and routes to /tasks
  const monthlyMentors = useMemo(() => mentors.slice(0, 3), [mentors]);

  // Simple activity sparkline data based on progress trend
  const activityPoints = useMemo(() => {
    const arr = tasks.slice(0, 8).map(t => t.progress);
    if (arr.length === 0) return [10,20,15,25,18,30,22,28];
    return arr;
  }, [tasks]);

  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const startWeekDay = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();
  const calendarDays = Array.from({ length: startWeekDay + daysInMonth }, (_, i) => i - startWeekDay + 1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your tasks.</p>
        </div>

        {/* Global search lives in header; no duplicate search here */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{getStatusCount('in-progress')}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{getStatusCount('completed')}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
        <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-3xl font-bold text-red-600">{getStatusCount('overdue')}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress + Activity + Calendar Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Progress */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Progress</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Average Completion</span>
                <span className="text-lg font-bold text-blue-600">{getTotalProgress()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getTotalProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-900 inline-flex items-center"><Activity className="h-5 w-5 mr-2 text-blue-600"/> Activity</h2>
          </div>
          <svg className="w-full h-28" viewBox="0 0 200 80">
            <polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              points={activityPoints.map((p, i) => `${(i/(activityPoints.length-1))*200},${80 - (p/100)*70}`).join(' ')}
            />
          </svg>
          <p className="text-xs text-gray-500 mt-1">Last {activityPoints.length} tasks progress trend</p>
        </div>

        {/* Mini Calendar */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 inline-flex items-center"><CalendarIcon className="h-5 w-5 mr-2 text-purple-600"/> {today.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h2>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-600 mb-1">
            {['S','M','T','W','T','F','S'].map(d => (<div key={d} className="py-1">{d}</div>))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((d, idx) => (
              <div key={idx} className={`py-2 rounded ${d===today.getDate()? 'bg-blue-600 text-white' : d>0? 'bg-gray-50 text-gray-700' : ''}`}>{d>0? d: ''}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
        </div>
        <div className="space-y-4">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleTaskClick(task)}
              className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-blue-300 cursor-pointer transition-all duration-200"
            >
              <img
                src={task.image}
                alt={task.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{task.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 relative">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={`${28 * 2 * Math.PI}`}
                      strokeDashoffset={`${28 * 2 * Math.PI - (task.progress / 100) * (28 * 2 * Math.PI)}`}
                      strokeLinecap="round"
                      className={`transition-all duration-500 ease-in-out ${
                        task.progress >= 80 ? 'text-green-600' :
                        task.progress >= 60 ? 'text-blue-600' :
                        task.progress >= 40 ? 'text-yellow-600' :
                        task.progress >= 20 ? 'text-orange-600' :
                        'text-gray-400'
                      }`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-xs font-semibold ${
                      task.progress >= 80 ? 'text-green-600' :
                      task.progress >= 60 ? 'text-blue-600' :
                      task.progress >= 40 ? 'text-yellow-600' :
                      task.progress >= 20 ? 'text-orange-600' :
                      'text-gray-400'
                    }`}>
                      {task.progress}%
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">Progress</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Mentors */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Monthly Mentors</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {monthlyMentors.map((m) => (
            <div key={m.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200">
              <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{m.name}</p>
                <p className="text-sm text-gray-600 truncate">{m.role}</p>
              </div>
            </div>
          ))}
          {monthlyMentors.length === 0 && (
            <div className="col-span-full text-center text-gray-500">No mentors yet</div>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetail
        task={selectedTask}
        isOpen={isTaskDetailOpen}
        onClose={closeTaskDetail}
      />

      {/* Help Center floating card */}
      <button
        className="fixed left-4 bottom-4 z-40 bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-3 text-left hover:shadow-xl transition hidden md:flex items-center space-x-3"
        title="Help Center"
      >
        <HelpCircle className="h-5 w-5 text-gray-700" />
        <div>
          <div className="text-sm font-medium text-gray-900">Help Center</div>
          <div className="text-xs text-gray-500">Need assistance? Click here</div>
        </div>
      </button>
    </div>
  );
};

export default Dashboard;