import React, { useState } from 'react';
import { Phone, TrendingUp, AlertCircle } from 'lucide-react';
import { PhoneSetterForm as PhoneSetterFormType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { submissionService } from '../../lib/supabase';

const PhoneSetterForm: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [formData, setFormData] = useState<Partial<PhoneSetterFormType>>({
    date: new Date().toISOString().split('T')[0],
    userId: user?.id || '',
    totalDials: undefined,
    replies: undefined,
    meaningfulConversations: undefined,
    totalSets: undefined,
    inboundCallsOnCalendar: undefined,
    inboundShowed: undefined,
    inboundSets: undefined,
    setsOnCloserCalendar: undefined,
    setsShowedUp: undefined,
    closes: undefined,
    newCashCollected: undefined,
    revenue: undefined,
    callOutcomes: '',
    performanceRating: 5,
    improvementNeeds: '',
    weeklyProjections: '',
    monthlyProjections: '',
    helpNeeded: '',
  });

  // Load existing submission for today on component mount
  React.useEffect(() => {
    const loadExistingSubmission = async () => {
      if (!user?.id || !formData.date) return;
      
      try {
        const existing = await submissionService.getByUserAndDate(user.id, formData.date);
        if (existing) {
          setFormData({
            date: existing.submission_date,
            userId: existing.user_id,
            ...existing.data
          });
        }
      } catch (error) {
        console.error('Error loading existing submission:', error);
      }
    };
    
    loadExistingSubmission();
  }, [user?.id, formData.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      await submissionService.upsert({
        user_id: user.id,
        submission_date: formData.date!,
        submission_type: 'phone-setter',
        data: {
          totalDials: formData.totalDials,
          replies: formData.replies,
          meaningfulConversations: formData.meaningfulConversations,
          totalSets: formData.totalSets,
          inboundCallsOnCalendar: formData.inboundCallsOnCalendar,
          inboundShowed: formData.inboundShowed,
          inboundSets: formData.inboundSets,
          setsOnCloserCalendar: formData.setsOnCloserCalendar,
          setsShowedUp: formData.setsShowedUp,
          closes: formData.closes,
          newCashCollected: formData.newCashCollected,
          revenue: formData.revenue,
          callOutcomes: formData.callOutcomes,
          performanceRating: formData.performanceRating,
          improvementNeeds: formData.improvementNeeds,
          weeklyProjections: formData.weeklyProjections,
          monthlyProjections: formData.monthlyProjections,
          helpNeeded: formData.helpNeeded,
        }
      });
      
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? (value === '' ? undefined : parseFloat(value) || 0) : value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
          <div className="flex items-center space-x-3">
            <Phone className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Phone Setter EOD Form</h2>
          </div>
          <p className="text-primary-100 mt-1">Submit your daily performance metrics</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Success/Error Messages */}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">EOD form submitted successfully!</p>
            </div>
          )}
          
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">Error: {submitError}</p>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Call Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-primary-600" />
              Call Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Dials</label>
                <input
                  type="number"
                  name="totalDials"
                  value={formData.totalDials}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Replies / Answers</label>
                <input
                  type="number"
                  name="replies"
                  value={formData.replies}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meaningful Conversations</label>
                <input
                  type="number"
                  name="meaningfulConversations"
                  value={formData.meaningfulConversations}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Sets & Appointments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-secondary-600" />
              Sets & Appointments
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Sets</label>
                <input
                  type="number"
                  name="totalSets"
                  value={formData.totalSets}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inbound Calls on Calendar</label>
                <input
                  type="number"
                  name="inboundCallsOnCalendar"
                  value={formData.inboundCallsOnCalendar}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inbound Showed</label>
                <input
                  type="number"
                  name="inboundShowed"
                  value={formData.inboundShowed}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inbound Sets</label>
                <input
                  type="number"
                  name="inboundSets"
                  value={formData.inboundSets}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sets on Closer Calendar Today</label>
                <input
                  type="number"
                  name="setsOnCloserCalendar"
                  value={formData.setsOnCloserCalendar}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sets Showed Up</label>
                <input
                  type="number"
                  name="setsShowedUp"
                  value={formData.setsShowedUp}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Revenue & Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-accent-600" />
              Revenue & Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Closes</label>
                <input
                  type="number"
                  name="closes"
                  value={formData.closes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Cash Collected ($)</label>
                <input
                  type="number"
                  name="newCashCollected"
                  value={formData.newCashCollected}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Revenue ($)</label>
                <input
                  type="number"
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>

          {/* Qualitative Data */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-secondary-600" />
              Qualitative Feedback
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Outcomes</label>
                <textarea
                  name="callOutcomes"
                  value={formData.callOutcomes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe call outcomes and quality"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Performance Rating (1-10)</label>
                <select
                  name="performanceRating"
                  value={formData.performanceRating}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What could be improved?</label>
                <textarea
                  name="improvementNeeds"
                  value={formData.improvementNeeds}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Areas for improvement"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What do you need help with?</label>
                <textarea
                  name="helpNeeded"
                  value={formData.helpNeeded}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Support needed"
                />
              </div>
            </div>
          </div>

          {/* Projections */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Projections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Projections</label>
                <textarea
                  name="weeklyProjections"
                  value={formData.weeklyProjections}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Weekly targets and projections"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Projections</label>
                <textarea
                  name="monthlyProjections"
                  value={formData.monthlyProjections}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Monthly targets and projections"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 transform hover:scale-105'
              } text-white`}
            >
              {isSubmitting ? 'Submitting...' : 'Save EOD Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhoneSetterForm;