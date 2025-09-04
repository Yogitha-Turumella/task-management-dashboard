import React, { useMemo, useState } from 'react';
import { Filter, Search, Clock, Flame, Sparkles, HelpCircle } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
// import { useMentors } from '../hooks/useMentors';
import { Task } from '../types';
import TaskDetail from '../components/Tasks/TaskDetail';
import ProgressCircle from '../components/Tasks/ProgressCircle';
import { useNavigate, useLocation } from 'react-router-dom';

const Tasks: React.FC = () => {
  const { tasks } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Task['status']>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Read ?q= from URL (header search)
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setSearchTerm(q);
  }, [location.search]);

  // Students cannot create or edit tasks in this UI

  const filteredTasks = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return tasks.filter(task => {
      const matchesSearch = q === '' ||
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q) ||
        task.assignedTo.toLowerCase().includes(q);
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, filterStatus]);

  const daysUntil = (date: string) => Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const timeLimitTasks = useMemo(() => {
    return [...filteredTasks]
      .filter(t => daysUntil(t.dueDate) <= 3)
      .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate))
      .slice(0, 6);
  }, [filteredTasks]);

  const newTasks = useMemo(() => {
    return [...filteredTasks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [filteredTasks]);

  const recommendedTasks = useMemo(() => {
    const candidates = filteredTasks.filter(t => t.status !== 'completed');
    const prioritized = candidates.sort((a, b) => {
      const priorityScore = (p: Task['priority']) => (p === 'high' ? 3 : p === 'medium' ? 2 : 1);
      return priorityScore(b.priority) - priorityScore(a.priority);
    });
    return prioritized.slice(0, 6);
  }, [filteredTasks]);

  const openDetail = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  const closeDetail = () => {
    setIsTaskDetailOpen(false);
    setSelectedTask(null);
  };

  const TaskCard: React.FC<{ task: Task; showProgress?: boolean }> = ({ task, showProgress = true }) => (
    <div
      onClick={() => openDetail(task)}
      className="group cursor-pointer bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden"
    >
      <div className="relative">
        <img
          src={task.image}
          alt={task.title}
          className="w-full h-40 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
          }}
        />
        <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 text-xs font-medium capitalize">
          {task.priority}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">{task.title}</h3>
          {showProgress && <ProgressCircle progress={task.progress} size={44} />}
        </div>
        <p className="text-sm text-gray-600 whitespace-pre-line">
          {task.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <span className="inline-flex items-center"><Clock className="h-3.5 w-3.5 mr-1" /> {daysUntil(task.dueDate)} days left</span>
          <span className="capitalize">{task.status.replace('-', ' ')}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tasks Management</h1>
          <p className="text-gray-600">View assigned tasks and recommendations</p>
        </div>
        <button
          onClick={() => navigate('/mentors')}
          className="hidden sm:flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-150"
        >
          <HelpCircle className="h-5 w-5 mr-2" />
          Get Help
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
        <form
          onSubmit={(e) => { e.preventDefault(); setSearchTerm((s) => s.trim()); }}
          className="grid grid-cols-1 sm:grid-cols-5 gap-3"
        >
          <div className="sm:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setSearchTerm((e.target as HTMLInputElement).value.trim()); } }}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search tasks"
                list="task-titles"
                autoComplete="off"
              />
              <datalist id="task-titles">
                {tasks.map(t => (
                  <option key={t.id} value={t.title} />
                ))}
              </datalist>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => { setSearchTerm(''); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="sm:col-span-2 flex items-stretch gap-2">
            <div className="flex-1 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | Task['status'])}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              aria-label="Search"
            >
              Search
            </button>
        </div>
        </form>
      </div>

      {searchTerm ? (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Search Results</h2>
            <span className="text-sm text-gray-500">{filteredTasks.length} match{filteredTasks.length===1?'':'es'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
            {filteredTasks.length === 0 && (
              <div className="col-span-full text-center text-gray-500">No tasks match your search</div>
            )}
          </div>
        </section>
      ) : (
      <>
      {/* Time Limit Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 inline-flex items-center"><Flame className="h-5 w-5 text-orange-600 mr-2" /> Time Limit</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {timeLimitTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
          {timeLimitTasks.length === 0 && (
            <div className="col-span-full text-center text-gray-500">No tasks close to deadline</div>
          )}
        </div>
      </section>

      {/* New Tasks Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">New Tasks</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
          {newTasks.length === 0 && (
            <div className="col-span-full text-center text-gray-500">No new tasks</div>
          )}
        </div>
      </section>
      </>
      )}

      {/* Recommended Section (no progress shown) */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 inline-flex items-center"><Sparkles className="h-5 w-5 text-purple-600 mr-2" /> Recommended</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedTasks.map(task => (
            <TaskCard key={task.id} task={task} showProgress={false} />
          ))}
          {recommendedTasks.length === 0 && (
            <div className="col-span-full text-center text-gray-500">No recommendations right now</div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <TaskDetail task={selectedTask} isOpen={isTaskDetailOpen} onClose={closeDetail} />

      {/* Floating help button on mobile */}
      <button
        onClick={() => navigate('/mentors')}
        className="fixed right-4 bottom-4 z-40 bg-gray-900 text-white shadow-lg rounded-full p-4 md:hidden"
        aria-label="Get Help"
      >
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Tasks;