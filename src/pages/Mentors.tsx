import React, { useState, useEffect } from 'react';
import { MessageCircle, Star, MapPin, Calendar, Clock } from 'lucide-react';
import { Mentor } from '../types';
import { api } from '../services/api';
import MentorMessage from '../components/Mentors/MentorMessage';

const Mentors: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpertise, setFilterExpertise] = useState<string>('all');

  useEffect(() => {
    const fetchMentors = async () => {
      const fetchedMentors = await api.getAllMentors();
      setMentors(fetchedMentors);
    };
    fetchMentors();
  }, []);

  const handleMessageMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsMessageOpen(true);
  };

  const closeMessage = () => {
    setIsMessageOpen(false);
    setSelectedMentor(null);
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpertise = filterExpertise === 'all' || 
                            mentor.expertise.some(exp => exp.toLowerCase().includes(filterExpertise.toLowerCase()));
    return matchesSearch && matchesExpertise;
  });

  const allExpertise = Array.from(new Set(mentors.flatMap(mentor => mentor.expertise)));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentors</h1>
          <p className="text-gray-600 mt-1">Connect with experienced professionals and get guidance</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search mentors by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="md:w-48">
            <select
              value={filterExpertise}
              onChange={(e) => setFilterExpertise(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Expertise</option>
              {allExpertise.map(expertise => (
                <option key={expertise} value={expertise}>{expertise}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            {/* Mentor Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    mentor.isOnline ? 'bg-green-400' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{mentor.name}</h3>
                  <p className="text-gray-600 text-sm">{mentor.role}</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      mentor.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {mentor.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expertise */}
            <div className="p-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0">
              <button
                onClick={() => handleMessageMentor(mentor)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Message Mentor</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Message Modal */}
      <MentorMessage
        mentor={selectedMentor}
        isOpen={isMessageOpen}
        onClose={closeMessage}
      />
    </div>
  );
};

export default Mentors;
