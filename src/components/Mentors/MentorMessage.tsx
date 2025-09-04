import React, { useEffect, useState } from 'react';
import { X, Send, MessageCircle, User, Clock } from 'lucide-react';
import { Mentor } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'mentor';
  content: string;
  timestamp: Date;
}

interface MentorMessageProps {
  mentor: Mentor | null;
  isOpen: boolean;
  onClose: () => void;
}

const MentorMessage: React.FC<MentorMessageProps> = ({ mentor, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Ensure greeting always includes the correct mentor name and resets when mentor/modal changes
  useEffect(() => {
    if (mentor && isOpen) {
      const mentorName = mentor.name || 'your mentor';
      setMessages([
        {
          id: 'welcome',
          sender: 'mentor',
          content: `Hello! I'm ${mentorName}. How can I help you today?`,
          timestamp: new Date(Date.now() - 60000)
        }
      ]);
    }
  }, [mentor, isOpen]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        content: message.trim(),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate mentor response
      setTimeout(() => {
        const mentorResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'mentor',
          content: 'Thanks for your message! I\'ll get back to you soon.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, mentorResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!mentor || !isOpen) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Message Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    mentor.isOnline ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{mentor.name}</h2>
                  <p className="text-green-100 text-sm">{mentor.role}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-green-100">
                      {mentor.isOnline ? 'Online' : 'Offline'}
                    </span>
                    <span className="text-xs text-green-100">•</span>
                    <span className="text-xs text-green-100">
                      {mentor.expertise.slice(0, 2).join(', ')}
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 max-h-[50vh] bg-gray-50">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <div className={`flex items-center justify-end mt-1 text-xs ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={2}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center text-sm text-gray-500">
              <MessageCircle className="h-4 w-4 inline mr-1" />
              Messages are end-to-end encrypted and private
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorMessage;
