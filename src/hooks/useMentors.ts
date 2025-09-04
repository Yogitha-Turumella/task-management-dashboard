import { useState, useEffect } from 'react';
import { Mentor } from '../types';
import { api } from '../services/api';

export const useMentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const fetchedMentors = await api.getAllMentors();
      setMentors(fetchedMentors);
      setError(null);
    } catch (err) {
      setError('Failed to fetch mentors');
      console.error('Error fetching mentors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  return {
    mentors,
    loading,
    error,
    fetchMentors
  };
};