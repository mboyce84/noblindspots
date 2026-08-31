import React, { useState } from 'react';
import { Target, TrendingUp, DollarSign } from 'lucide-react';
import { CloserForm as CloserFormType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { submissionService } from '../../lib/supabase';

const CloserForm: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [formData, setFormData] = useState<Partial<CloserFormType>>({
    date: new Date().toISOString().split('T')[0],
    userId: user?.id || '',
    discoveryCallsBooked: undefined,
    discoveryCallNoShows: undefined,
    sentBackToSetter: undefined,
    discoveryCallsTaken: undefined,
    rescheduledDiscoveryCalls: undefined,
    followUpCallsTaken: undefined,
    offersMade: undefined,
    reOffers: undefined,
    projectedToClose: undefined,
    totalCloses: undefined,
    pifsPaymentPlansDeposits: undefined,
    cashCollected: undefined,
    revenueClosed: undefined,
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
        submission_type: 'closer',
        data: {
          discoveryCallsBooked: formData.discoveryCallsBooked,
          discoveryCallNoShows: formData.discoveryCallNoShows,
          sentBackToSetter: formData.sentBackToSetter,
          discoveryCallsTaken: formData.discoveryCallsTaken,
          rescheduledDiscoveryCalls: formData.rescheduledDiscoveryCalls,
          followUpCallsTaken: formData.followUpCallsTaken,
          offersMade: formData.offersMade,
          reOffers: formData.reOffers,
          projectedToClose: formData.projectedToClose,
          totalCloses: formData.totalCloses,
          pifsPaymentPlansDeposits: formData.pifsPaymentPlansDeposits,
          cashCollected: formData.cashCollected,
          revenueClosed: formData.revenueClosed,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 px-6 py-4">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Closer EOD Form</h2>
          </div>
          <p className="text-secondary-100 mt-1">Track your daily closing performance</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Discovery Calls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2 text-secondary-600" />
              Discovery Calls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discovery Calls Booked</label>
                <input
                  type="number"
                  name="discoveryCallsBooked"
                  value={formData.discoveryCallsBooked}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discovery Call No-Shows</label>
                <input
                  type="number"
                  name="discoveryCallNoShows"
                  value={formData.discoveryCallNoShows}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sent Back to Setter</label>
                <input
                  type="number"
                  name="sentBackToSetter"
                  value={formData.sentBackToSetter}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discovery Calls Taken</label>
                <input
                  type="number"
                  name="discoveryCallsTaken"
                  value={formData.discoveryCallsTaken}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rescheduled Discovery Calls</label>
                <input
                  type="number"
                  name="rescheduledDiscoveryCalls"
                  value={formData.rescheduledDiscoveryCalls}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Calls Taken</label>
                <input
                  type="number"
                  name="followUpCallsTaken"
                  value={formData.followUpCallsTaken}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Offers & Closes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-accent-600" />
              Offers & Closes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Offers Made</label>
                <input
                  type="number"
                  name="offersMade"
                  value={formData.offersMade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Re-Offers</label>
                <input
                  type="number"
                  name="reOffers"
                  value={formData.reOffers}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Projected to Close</label>
                <input
                  type="number"
                  name="projectedToClose"
                  value={formData.projectedToClose}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Closes</label>
                <input
                  type="number"
                  name="totalCloses"
                  value={formData.totalCloses}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Financial Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Financial Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PIFs / Payment Plans / Deposits</label>
                <input
                  type="number"
                  name="pifsPaymentPlansDeposits"
                  value={formData.pifsPaymentPlansDeposits}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cash Collected ($)</label>
                <input
                  type="number"
                  name="cashCollected"
                  value={formData.cashCollected}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Closed ($)</label>
                <input
                  type="number"
                  name="revenueClosed"
                  value={formData.revenueClosed}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  min="0"
                  step="1"
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
                  : 'bg-secondary-600 hover:bg-secondary-700 transform hover:scale-105'
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

export default CloserForm;