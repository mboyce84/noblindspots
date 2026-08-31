import React, { useState, useEffect } from 'react';
import { Target, X, DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { teamGoalsService } from '../../lib/supabase';
import { TeamGoal } from '../../types';

interface TeamGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalUpdated: () => void;
}

const TeamGoalsModal: React.FC<TeamGoalsModalProps> = ({ isOpen, onClose, onGoalUpdated }) => {
  const { user } = useAuth();
  const [goalAmount, setGoalAmount] = useState<number>(0);
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // YYYY-MM format
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingGoal, setExistingGoal] = useState<TeamGoal | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadExistingGoal();
    }
  }, [isOpen, user, selectedMonth]);

  const loadExistingGoal = async () => {
    if (!user) return;
    
    try {
      const goals = await teamGoalsService.getByUserId(user.id, selectedMonth);
      if (goals.length > 0) {
        const goal = goals[0];
        setExistingGoal(goal);
        setGoalAmount(goal.goalAmount);
        setCurrentAmount(goal.currentAmount);
      } else {
        setExistingGoal(null);
        setGoalAmount(0);
        setCurrentAmount(0);
      }
    } catch (err) {
      console.error('Error loading existing goal:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await teamGoalsService.upsert({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        month: selectedMonth,
        goalAmount,
        currentAmount
      });

      onGoalUpdated();
      onClose();
    } catch (err) {
      console.error('Error saving goal:', err);
      setError(err instanceof Error ? err.message : 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setGoalAmount(0);
    setCurrentAmount(0);
    setError(null);
    setExistingGoal(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-white" />
              <h2 className="text-xl font-semibold text-white">
                {existingGoal ? 'Update Goal' : 'Set Monthly Goal'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Goal Amount
            </label>
            <input
              type="number"
              value={goalAmount}
              onChange={(e) => setGoalAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your monthly goal"
              min="0"
              step="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-2" />
              Current Progress
            </label>
            <input
              type="number"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter current amount achieved"
              min="0"
              step="100"
              required
            />
          </div>

          {goalAmount > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-primary-600">
                  {goalAmount > 0 ? ((currentAmount / goalAmount) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((currentAmount / goalAmount) * 100, 100)}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>${currentAmount.toLocaleString()}</span>
                <span>${goalAmount.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 transform hover:scale-105'
              } text-white`}
            >
              {loading ? 'Saving...' : existingGoal ? 'Update Goal' : 'Set Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamGoalsModal;