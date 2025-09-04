import { Task, Mentor } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Real API functions connecting to backend
class API {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Task APIs
  async getAllTasks(): Promise<Task[]> {
    console.log('API: Fetching tasks from', `${API_BASE_URL}/tasks`);
    try {
      const tasks = await this.request<Task[]>('/tasks');
      console.log('API: Successfully fetched', tasks.length, 'tasks');
      return tasks;
    } catch (error) {
      console.error('API: Error fetching tasks, using mock data:', error);
      // Fallback to mock data if backend fails
      const { mockTasks } = await import('../data/mockData');
      return mockTasks;
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      return await this.request<Task>(`/tasks/${id}`);
    } catch (error) {
      return null;
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      return await this.request<Task>(`/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      return null;
    }
  }

  async submitTaskFiles(taskId: string, files: File[]): Promise<{ ok: boolean; files: any[]; task: Task }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/submissions`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Mentor APIs (using mock data for now)
  async getAllMentors(): Promise<Mentor[]> {
    // For now, return mock mentors since we haven't implemented mentor endpoints
    const { mockMentors } = await import('../data/mockData');
    return mockMentors;
  }
}

export const api = new API();