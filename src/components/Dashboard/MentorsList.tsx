import React from 'react';
import { MessageCircle, Star } from 'lucide-react';
import { Mentor } from '../../types';

interface MentorsListProps {
  mentors: Mentor[];
}

const MentorsList: React.FC<MentorsListProps> = ({ mentors }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Team Mentors</h3>
        <p className="text-sm text-gray-500">Get help from experienced team members</p>
      </div>
      
      <div className="p-6 space-y-4">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={mentor.avatar}
                  alt={mentor.name}
                />
                {mentor.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{mentor.name}</h4>
                <p className="text-xs text-gray-500">{mentor.role}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mentor.expertise.slice(0, 2).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                  {mentor.expertise.length > 2 && (
                    <span className="text-xs text-gray-400">
                      +{mentor.expertise.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-xs text-gray-600 ml-1">4.9</span>
              </div>
              <button
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-150"
                disabled={!mentor.isOnline}
              >
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorsList;