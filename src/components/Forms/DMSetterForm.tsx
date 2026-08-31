import React, { useState } from 'react';
import { MessageCircle, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';
import { DMSetterForm as DMSetterFormType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { submissionService } from '../../lib/supabase';

const DMSetterForm: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [formData, setFormData] = useState<Partial<DMSetterFormType>>({
    date: new Date().toISOString().split('T')[0],
    userId: user?.id || '',
    outboundIGDMsSent: undefined,
    outboundIGDMsReplied: undefined,
    inboundDMs: undefined,
    qualityInbounds: undefined,
    inboundComments: undefined,
    followUps: undefined,
    callsProposed: undefined,
    linksSent: undefined,
    totalCallsBooked: undefined,
    setsScheduled: undefined,
    setsTaken: undefined,
    setsOutcomes: '',
    setsClosed: undefined,
    revenue: undefined,
    cashCollected: undefined,
    recurring: undefined,
    timeSpentMessaging: undefined,
    crmUpdated: false,
    reschedulesFollowedUp: false,
    noShowsFollowedUp: false,
    voiceNotesSentToCloser: undefined,
    kpiGapNotes: '',
    performanceRating: 5,
    performanceNotes: '',
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
        submission_type: 'dm-setter',
        data: {
          outboundIGDMsSent: formData.outboundIGDMsSent,
          outboundIGDMsReplied: formData.outboundIGDMsReplied,
          inboundDMs: formData.inboundDMs,
          qualityInbounds: formData.qualityInbounds,
          inboundComments: formData.inboundComments,
          followUps: formData.followUps,
          callsProposed: formData.callsProposed,
          linksSent: formData.linksSent,
          totalCallsBooked: formData.totalCallsBooked,
          setsScheduled: formData.setsScheduled,
          setsTaken: formData.setsTaken,
          setsOutcomes: formData.setsOutcomes,
          setsClosed: formData.setsClosed,
          revenue: formData.revenue,
          cashCollected: formData.cashCollected,
          recurring: formData.recurring,
          timeSpentMessaging: formData.timeSpentMessaging,
          crmUpdated: formData.crmUpdated,
          reschedulesFollowedUp: formData.reschedulesFollowedUp,
          noShowsFollowedUp: formData.noShowsFollowedUp,
          voiceNotesSentToCloser: formData.voiceNotesSentToCloser,
          kpiGapNotes: formData.kpiGapNotes,
          performanceRating: formData.performanceRating,
          performanceNotes: formData.performanceNotes,
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
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : parseFloat(value) || 0) : 
               type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent-600 to-accent-700 px-6 py-4">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">DM Setter EOD Form</h2>
          </div>
          <p className="text-accent-100 mt-1">Track your direct message and setting performance</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Spent Messaging (hours)</label>
              <input
                type="number"
                name="timeSpentMessaging"
                value={formData.timeSpentMessaging}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                min="0"
                step="0.5"
              />
            </div>
          </div>

          {/* DM Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-accent-600" />
              DM Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Outbound IG DMs Sent</label>
                <input
                  type="number"
                  name="outboundIGDMsSent"
                  value={formData.outboundIGDMsSent}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Outbound IG DMs Replied</label>
                <input
                  type="number"
                  name="outboundIGDMsReplied"
                  value={formData.outboundIGDMsReplied}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inbound DMs</label>
                <input
                  type="number"
                  name="inboundDMs"
                  value={formData.inboundDMs}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality Inbounds</label>
                <input
                  type="number"
                  name="qualityInbounds"
                  value={formData.qualityInbounds}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inbound Comments</label>
                <input
                  type="number"
                  name="inboundComments"
                  value={formData.inboundComments}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Follow-Ups</label>
                <input
                  type="number"
                  name="followUps"
                  value={formData.followUps}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Call Booking */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-secondary-600" />
              Call Booking & Sets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calls Proposed</label>
                <input
                  type="number"
                  name="callsProposed"
                  value={formData.callsProposed}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Links Sent</label>
                <input
                  type="number"
                  name="linksSent"
                  value={formData.linksSent}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Calls Booked</label>
                <input
                  type="number"
                  name="totalCallsBooked"
                  value={formData.totalCallsBooked}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sets Scheduled</label>
                <input
                  type="number"
                  name="setsScheduled"
                  value={formData.setsScheduled}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sets Taken</label>
                <input
                  type="number"
                  name="setsTaken"
                  value={formData.setsTaken}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sets Closed</label>
                <input
                  type="number"
                  name="setsClosed"
                  value={formData.setsClosed}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sets Outcomes</label>
              <textarea
                name="setsOutcomes"
                value={formData.setsOutcomes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                placeholder="Describe outcomes of your sets"
              />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Revenue ($)</label>
                <input
                  type="number"
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recurring ($)</label>
                <input
                  type="number"
                  name="recurring"
                  value={formData.recurring}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  min="0"
                  step="1"
                />
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-secondary-600" />
              Daily Checklist
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="crmUpdated"
                  checked={formData.crmUpdated}
                  onChange={handleChange}
                  className="w-4 h-4 text-accent-600 border-gray-300 rounded focus:ring-accent-500"
                />
                <label className="text-sm font-medium text-gray-700">CRM Updated</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="reschedulesFollowedUp"
                  checked={formData.reschedulesFollowedUp}
                  onChange={handleChange}
                  className="w-4 h-4 text-accent-600 border-gray-300 rounded focus:ring-accent-500"
                />
                <label className="text-sm font-medium text-gray-700">Reschedules Followed Up</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="noShowsFollowedUp"
                  checked={formData.noShowsFollowedUp}
                  onChange={handleChange}
                  className="w-4 h-4 text-accent-600 border-gray-300 rounded focus:ring-accent-500"
                />
                <label className="text-sm font-medium text-gray-700">No-Shows Followed Up</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Voice Notes Sent to Closer</label>
                <input
                  type="number"
                  name="voiceNotesSentToCloser"
                  value={formData.voiceNotesSentToCloser}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Performance & Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance & Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Performance Rating (1-10)</label>
                <select
                  name="performanceRating"
                  value={formData.performanceRating}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Performance Notes</label>
                <textarea
                  name="performanceNotes"
                  value={formData.performanceNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="Additional performance notes"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">KPI Gap Notes</label>
                <textarea
                  name="kpiGapNotes"
                  value={formData.kpiGapNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  placeholder="Notes about KPI gaps and improvements needed"
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
                  : 'bg-accent-600 hover:bg-accent-700 transform hover:scale-105'
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

export default DMSetterForm;