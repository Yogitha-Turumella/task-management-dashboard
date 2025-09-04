import React from 'react';
import { Edit, Trash2, Calendar, User, Flag } from 'lucide-react';
import { Task } from '../../types';
import ProgressCircle from './ProgressCircle';

interface TasksListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

const TasksList: React.FC<TasksListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const getStatusBadge = (status: Task['status']) => {
    const statusConfig = {
      pending: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Pending' },
      'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      overdue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Overdue' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    const priorityConfig = {
      low: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '🟢' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🟡' },
      high: { bg: 'bg-red-100', text: 'text-red-800', icon: '🔴' }
    };

    const config = priorityConfig[priority];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon} {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-4 sm:space-y-0">
            {/* Task Image */}
            <div className="flex-shrink-0">
              <img
                src={task.image}
                alt={task.title}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
                }}
              />
            </div>
            
            {/* Task Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {task.title}
                </h3>
                {getPriorityBadge(task.priority)}
                {getStatusBadge(task.status)}
              </div>
              
              <p className="text-gray-600 mb-4 whitespace-pre-line">{task.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Due: {formatDate(task.dueDate)}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {task.assignedTo}
                </div>
              </div>
            </div>
            
            {/* Progress Circle */}
            <div className="flex-shrink-0 flex flex-row sm:flex-col items-center sm:items-center space-x-4 sm:space-x-0 space-y-0 sm:space-y-2 mt-2 sm:mt-0">
              <ProgressCircle progress={task.progress} size={70} />
              <span className="text-xs text-gray-500 font-medium">Progress</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
                className="text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors duration-150"
              >
                <Edit className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => onDelete(task.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors duration-150"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Flag className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500">Create your first task to get started!</p>
        </div>
      )}
    </div>
  );
};

export default TasksList;