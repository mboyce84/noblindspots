import React, { useState, useEffect } from 'react';
import { Target, Plus, Edit, TrendingUp, Users, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { teamGoalsService } from '../../lib/supabase';
import { TeamGoal } from '../../types';
import TeamGoalsModal from './TeamGoalsModal';

const TeamGoalsSection: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<TeamGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );

  useEffect(() => {
    loadGoals();
  }, [selectedMonth]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await teamGoalsService.getAll(selectedMonth);
      setGoals(data);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalUpdated = () => {
    loadGoals();
  };

  const getUserGoal = () => {
    return goals.find(g => g.userId === user?.id);
  };

  const getTeamTotals = () => {
    const totalGoal = goals.reduce((sum, goal) => sum + goal.goalAmount, 0);
    const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const percentage = totalGoal > 0 ? (totalCurrent / totalGoal) * 100 : 0;
    
    return { totalGoal, totalCurrent, percentage };
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'closer': return 'bg-green-100 text-green-800 border-green-200';
      case 'dm-setter': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'phone-setter': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const userGoal = getUserGoal();
  const teamTotals = getTeamTotals();

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Team Goals</h3>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              {user?.role !== 'admin' && (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                >
                  {userGoal ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{userGoal ? 'Update Goal' : 'Set Goal'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Team Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-700">Team Goal</p>
                  <p className="text-2xl font-bold text-primary-900">${teamTotals.totalGoal.toLocaleString()}</p>
                </div>
                <Target className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Current Progress</p>
                  <p className="text-2xl font-bold text-green-900">${teamTotals.totalCurrent.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-lg p-4 border border-secondary-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-700">Team Progress</p>
                  <p className="text-2xl font-bold text-secondary-900">{teamTotals.percentage.toFixed(1)}%</p>
                </div>
                <Users className="w-8 h-8 text-secondary-600" />
              </div>
            </div>
          </div>

          {/* Team Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Team Progress</span>
              <span className="text-sm font-bold text-primary-600">{teamTotals.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(teamTotals.percentage, 100)}%`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${teamTotals.totalCurrent.toLocaleString()}</span>
              <span>${teamTotals.totalGoal.toLocaleString()}</span>
            </div>
          </div>

          {/* Individual Goals */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Individual Goals</h4>
            {goals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No goals set for this month yet.</p>
                {user?.role !== 'admin' && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Set Your Goal
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => {
                  const percentage = goal.goalAmount > 0 ? (goal.currentAmount / goal.goalAmount) * 100 : 0;
                  const isCurrentUser = goal.userId === user?.id;
                  
                  return (
                    <div
                      key={goal.id}
                      className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                        isCurrentUser ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <Target className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900">
                              {goal.userName}
                              {isCurrentUser && <span className="text-primary-600 ml-1">(You)</span>}
                            </h5>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(goal.userRole)}`}>
                              {goal.userRole.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                        </div>
                        {isCurrentUser && user?.role !== 'admin' && (
                          <button
                            onClick={() => setShowModal(true)}
                            className="text-primary-600 hover:text-primary-800 p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Goal: ${goal.goalAmount.toLocaleString()}</span>
                          <span className="font-medium text-gray-900">{percentage.toFixed(1)}%</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              percentage >= 100 ? 'bg-green-500' : 
                              percentage >= 75 ? 'bg-primary-500' : 
                              percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{
                              width: `${Math.min(percentage, 100)}%`
                            }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>${goal.currentAmount.toLocaleString()}</span>
                          <span>${(goal.goalAmount - goal.currentAmount).toLocaleString()} remaining</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <TeamGoalsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onGoalUpdated={handleGoalUpdated}
      />
    </>
  );
};

export default TeamGoalsSection;