import React, { useMemo, useRef, useState } from 'react';
import { X, Calendar, User, Tag, Clock, CheckCircle, AlertCircle, Play, Pause, UploadCloud } from 'lucide-react';
import { Task } from '../../types';
import ProgressCircle from './ProgressCircle';
import { api } from '../../services/api';

interface TaskDetailProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, isOpen, onClose }) => {
  if (!task || !isOpen) return null;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const essenceItems = useMemo(() => {
    // Derive 3-5 essence points from description as a placeholder
    const base = task.description.split(/\.|\n/).map(s => s.trim()).filter(Boolean);
    const fallbacks = [
      'Understand the problem and expected outcome',
      'Break the task into clear, achievable steps',
      'Demonstrate progress and iterate on feedback',
      'Prepare final deliverables following guidelines'
    ];
    const items = (base.length >= 3 ? base.slice(0, 4) : fallbacks).slice(0, 4);
    return items;
  }, [task.description]);

  const onDropFiles = (dropped: FileList | null) => {
    if (!dropped) return;
    const newFiles = Array.from(dropped).slice(0, 5);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);

  const markCompleted = async () => {
    if (!task || files.length === 0) return;
    try {
      setSubmitting(true);
      // Upload files and mark task as completed
      const result = await api.submitTaskFiles(task.id, files);
      if (result.ok) {
        setSubmitMsg('Files uploaded successfully. Task marked as completed.');
        // Fire a cross-page event so Dashboard/Tasks can update immediately
        window.dispatchEvent(new CustomEvent('task-updated', { detail: { id: task.id, updates: { status: 'completed', progress: 100 } } }));
        setFiles([]); // Clear files after successful submission
      }
    } catch (e) {
      setSubmitMsg('Failed to upload files. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Play className="h-5 w-5 text-blue-600" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Pause className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Task Detail Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-0 sm:p-4">
        <div className="bg-white rounded-none sm:rounded-xl shadow-2xl w-full max-w-6xl h-full sm:h-[95vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={task.image}
                  alt={task.title}
                  className="w-20 h-20 rounded-lg object-cover border-4 border-white/20"
                />
                <div>
                  <h2 className="text-2xl font-bold">{task.title}</h2>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                      <span className="ml-2 capitalize">{task.status.replace('-', ' ')}</span>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                      <Tag className="h-4 w-4 inline mr-1" />
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Intro Video */}
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-56 sm:h-64 object-cover"
                    controls
                    preload="auto"
                    playsInline
                  >
                    <source src="https://filesamples.com/samples/video/mp4/sample_960x400_ocean_with_audio.mp4" type="video/mp4" />
                  </video>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{task.description}</p>
                </div>

                {/* Progress Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress</h3>
                  <div className="flex items-center space-x-4">
                    <ProgressCircle progress={task.progress} size={80} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                        <span className="text-lg font-bold text-blue-600">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Essence of the Task */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Essence of the Task</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {essenceItems.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>

                {/* Task Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Task Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className="font-medium text-gray-900">{formatDate(task.dueDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Assigned To</p>
                        <p className="font-medium text-gray-900">{task.assignedTo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="font-medium text-gray-900">{formatDate(task.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="font-medium text-gray-900">{formatDate(task.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Timeline */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
                  <ol className="relative border-l border-gray-200 ml-2">
                    <li className="mb-6 ml-4">
                      <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-1.5 top-1.5" />
                      <time className="mb-1 text-xs font-normal text-gray-500">Start</time>
                      <p className="text-sm text-gray-700">Kickoff and requirement review</p>
                    </li>
                    <li className="mb-6 ml-4">
                      <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-1.5 top-1.5" />
                      <time className="mb-1 text-xs font-normal text-gray-500">Mid</time>
                      <p className="text-sm text-gray-700">Implement core functionality</p>
                    </li>
                    <li className="ml-4">
                      <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-1.5 top-1.5" />
                      <time className="mb-1 text-xs font-normal text-gray-500">Due</time>
                      <p className="text-sm text-gray-700">Finalize and submit deliverables</p>
                    </li>
                  </ol>
                </div>

                {/* Student Help */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
                  <p className="text-sm text-gray-700">You can ask mentors for guidance from the Mentors page.</p>
                </div>

                {/* Task Statistics */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Days Remaining</span>
                      <span className="font-medium text-gray-900">
                        {Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className="font-medium text-gray-900 capitalize">{task.status.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority</span>
                      <span className="font-medium text-gray-900 capitalize">{task.priority}</span>
                    </div>
                  </div>
                </div>

                {/* Submission Upload */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Submission</h3>
                  <label
                    onDragOver={(e) => { e.preventDefault(); }}
                    onDrop={(e) => { e.preventDefault(); onDropFiles(e.dataTransfer.files); }}
                    className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition"
                  >
                    <UploadCloud className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-sm text-gray-700">Drop files here or click to upload</span>
                    <input type="file" multiple className="hidden" onChange={(e) => onDropFiles(e.target.files)} />
                  </label>
                  {files.length > 0 && (
                    <ul className="mt-3 space-y-2 text-sm">
                      {files.map((f, idx) => (
                        <li key={idx} className="flex items-center justify-between border rounded px-3 py-2">
                          <span className="truncate max-w-[70%]">{f.name}</span>
                          <span className="text-gray-500">{(f.size/1024).toFixed(0)} KB</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={markCompleted}
                    disabled={submitting}
                    className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition"
                  >
                    {submitting ? 'Submitting...' : 'Submit Files & Mark Completed'}
                  </button>
                  {submitMsg && <p className="text-green-600 text-sm mt-2">{submitMsg}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-xs sm:text-sm text-gray-500">Task ID: {task.id}</div>
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetail;
