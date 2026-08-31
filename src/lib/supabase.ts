import { createClient } from '@supabase/supabase-js';
import { User, PhoneSetterForm, CloserForm, DMSetterForm, TeamGoal } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'closer' | 'dm-setter' | 'phone-setter';
  created_at: string;
  updated_at: string;
}

export interface DatabaseSubmission {
  id: string;
  user_id: string;
  submission_date: string;
  submission_type: 'phone-setter' | 'dm-setter' | 'closer';
  data: any;
  submitted_at: string;
  created_at: string;
  updated_at: string;
  users?: DatabaseUser;
}

// Mock users for demo purposes
const mockUsers: DatabaseUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@fbasu.com',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'John Closer',
    email: 'closer@fbasu.com',
    role: 'closer',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Sarah DM',
    email: 'dm@fbasu.com',
    role: 'dm-setter',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Mike Phone',
    email: 'phone@fbasu.com',
    role: 'phone-setter',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock submissions storage
let mockSubmissions: DatabaseSubmission[] = [];

// Mock team goals storage
let mockTeamGoals: TeamGoal[] = [
  {
    id: '1',
    userId: '2',
    userName: 'John Closer',
    userRole: 'closer',
    month: '2025-01',
    goalAmount: 50000,
    currentAmount: 32000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: '3',
    userName: 'Sarah DM',
    userRole: 'dm-setter',
    month: '2025-01',
    goalAmount: 25000,
    currentAmount: 18500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    userId: '4',
    userName: 'Mike Phone',
    userRole: 'phone-setter',
    month: '2025-01',
    goalAmount: 30000,
    currentAmount: 22000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// User operations
export const userService = {
  async getAll(): Promise<DatabaseUser[]> {
    // Return mock users instead of making Supabase call
    return Promise.resolve([...mockUsers]);
  },

  async getById(id: string): Promise<DatabaseUser | null> {
    const user = mockUsers.find(u => u.id === id);
    return Promise.resolve(user || null);
  },

  async getByEmail(email: string): Promise<DatabaseUser | null> {
    const user = mockUsers.find(u => u.email === email);
    return Promise.resolve(user || null);
  },

  async create(user: Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseUser> {
    const newUser: DatabaseUser = {
      ...user,
      id: (mockUsers.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return Promise.resolve(newUser);
  },

  async update(id: string, updates: Partial<Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>>): Promise<DatabaseUser> {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...mockUsers[userIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    mockUsers[userIndex] = updatedUser;
    return Promise.resolve(updatedUser);
  },

  async delete(id: string): Promise<void> {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    mockUsers.splice(userIndex, 1);
    return Promise.resolve();
  }
};

// Team goals operations
export const teamGoalsService = {
  async getAll(month?: string): Promise<TeamGoal[]> {
    let goals = [...mockTeamGoals];
    if (month) {
      goals = goals.filter(g => g.month === month);
    }
    return Promise.resolve(goals);
  },

  async getByUserId(userId: string, month?: string): Promise<TeamGoal[]> {
    let goals = mockTeamGoals.filter(g => g.userId === userId);
    if (month) {
      goals = goals.filter(g => g.month === month);
    }
    return Promise.resolve(goals);
  },

  async upsert(goal: Omit<TeamGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamGoal> {
    const existingIndex = mockTeamGoals.findIndex(
      g => g.userId === goal.userId && g.month === goal.month
    );

    const now = new Date().toISOString();
    const goalData: TeamGoal = {
      ...goal,
      id: existingIndex >= 0 ? mockTeamGoals[existingIndex].id : (mockTeamGoals.length + 1).toString(),
      createdAt: existingIndex >= 0 ? mockTeamGoals[existingIndex].createdAt : now,
      updatedAt: now
    };

    if (existingIndex >= 0) {
      mockTeamGoals[existingIndex] = goalData;
    } else {
      mockTeamGoals.push(goalData);
    }

    return Promise.resolve(goalData);
  },

  async delete(id: string): Promise<void> {
    const goalIndex = mockTeamGoals.findIndex(g => g.id === id);
    if (goalIndex === -1) {
      throw new Error('Goal not found');
    }
    mockTeamGoals.splice(goalIndex, 1);
    return Promise.resolve();
  },

  async getMonthlyTeamGoals(): Promise<{ month: string; totalGoal: number; totalCurrent: number; percentage: number }[]> {
    const monthlyData = new Map<string, { totalGoal: number; totalCurrent: number }>();
    
    mockTeamGoals.forEach(goal => {
      const existing = monthlyData.get(goal.month) || { totalGoal: 0, totalCurrent: 0 };
      monthlyData.set(goal.month, {
        totalGoal: existing.totalGoal + goal.goalAmount,
        totalCurrent: existing.totalCurrent + goal.currentAmount
      });
    });

    return Promise.resolve(
      Array.from(monthlyData.entries()).map(([month, data]) => ({
        month,
        totalGoal: data.totalGoal,
        totalCurrent: data.totalCurrent,
        percentage: data.totalGoal > 0 ? (data.totalCurrent / data.totalGoal) * 100 : 0
      })).sort((a, b) => a.month.localeCompare(b.month))
    );
  }
};

// EOD submission operations
export const submissionService = {
  async getAll(filters?: {
    userId?: string;
    role?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<DatabaseSubmission[]> {
    let filteredSubmissions = [...mockSubmissions];

    if (filters?.userId) {
      filteredSubmissions = filteredSubmissions.filter(s => s.user_id === filters.userId);
    }

    if (filters?.role) {
      filteredSubmissions = filteredSubmissions.filter(s => s.submission_type === filters.role);
    }

    if (filters?.dateFrom) {
      filteredSubmissions = filteredSubmissions.filter(s => s.submission_date >= filters.dateFrom!);
    }

    if (filters?.dateTo) {
      filteredSubmissions = filteredSubmissions.filter(s => s.submission_date <= filters.dateTo!);
    }

    // Add user data to submissions
    const submissionsWithUsers = filteredSubmissions.map(submission => ({
      ...submission,
      users: mockUsers.find(u => u.id === submission.user_id)
    }));

    return Promise.resolve(submissionsWithUsers.sort((a, b) => 
      new Date(b.submission_date).getTime() - new Date(a.submission_date).getTime()
    ));
  },

  async getByUserAndDate(userId: string, date: string): Promise<DatabaseSubmission | null> {
    const submission = mockSubmissions.find(s => s.user_id === userId && s.submission_date === date);
    if (submission) {
      return Promise.resolve({
        ...submission,
        users: mockUsers.find(u => u.id === submission.user_id)
      });
    }
    return Promise.resolve(null);
  },

  async upsert(submission: {
    user_id: string;
    submission_date: string;
    submission_type: 'phone-setter' | 'dm-setter' | 'closer';
    data: any;
  }): Promise<DatabaseSubmission> {
    const existingIndex = mockSubmissions.findIndex(
      s => s.user_id === submission.user_id && s.submission_date === submission.submission_date
    );

    const now = new Date().toISOString();
    const submissionData: DatabaseSubmission = {
      id: existingIndex >= 0 ? mockSubmissions[existingIndex].id : (mockSubmissions.length + 1).toString(),
      ...submission,
      submitted_at: now,
      created_at: existingIndex >= 0 ? mockSubmissions[existingIndex].created_at : now,
      updated_at: now,
      users: mockUsers.find(u => u.id === submission.user_id)
    };

    if (existingIndex >= 0) {
      mockSubmissions[existingIndex] = submissionData;
    } else {
      mockSubmissions.push(submissionData);
    }

    return Promise.resolve(submissionData);
  },

  async delete(id: string): Promise<void> {
    const submissionIndex = mockSubmissions.findIndex(s => s.id === id);
    if (submissionIndex === -1) {
      throw new Error('Submission not found');
    }
    mockSubmissions.splice(submissionIndex, 1);
    return Promise.resolve();
  },

  // Get compliance data for a specific month
  async getComplianceData(year: number, month: number, role?: string): Promise<DatabaseSubmission[]> {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of month

    let filteredSubmissions = mockSubmissions.filter(s => 
      s.submission_date >= startDate && s.submission_date <= endDate
    );

    if (role && role !== 'all') {
      filteredSubmissions = filteredSubmissions.filter(s => s.submission_type === role);
    }

    // Add user data to submissions
    const submissionsWithUsers = filteredSubmissions.map(submission => ({
      ...submission,
      users: mockUsers.find(u => u.id === submission.user_id)
    }));

    return Promise.resolve(submissionsWithUsers);
  }
};

// Authentication helpers
export const authService = {
  async signInWithEmail(email: string, password: string) {
    // Mock authentication - check against mock users
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'demo123') {
      return { user, error: null };
    }
    return { user: null, error: new Error('Invalid credentials') };
  },

  async signOut() {
    // Mock sign out
    return { error: null };
  },

  async getCurrentUser(): Promise<DatabaseUser | null> {
    // Mock current user - return null to rely on AuthContext
    return null;
  }
};

// Utility functions
export const formatSubmissionData = (
  formData: Partial<PhoneSetterForm | CloserForm | DMSetterForm>,
  submissionType: 'phone-setter' | 'dm-setter' | 'closer'
) => {
  // Remove undefined values and format data for storage
  const cleanData = Object.fromEntries(
    Object.entries(formData).filter(([_, value]) => value !== undefined && value !== '')
  );
  
  return {
    submission_type: submissionType,
    data: cleanData
  };
};

export const parseSubmissionData = (
  submission: DatabaseSubmission
): PhoneSetterForm | CloserForm | DMSetterForm => {
  return {
    id: submission.id,
    date: submission.submission_date,
    userId: submission.user_id,
    ...submission.data
  };
};