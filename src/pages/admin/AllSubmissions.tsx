import React, { useState } from 'react';
import { FileText, Filter, Eye, Calendar, User } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import { format } from 'date-fns';
import { submissionService, DatabaseSubmission } from '../../lib/supabase';

const AllSubmissions: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('week');
  const [viewingSubmission, setViewingSubmission] = useState<DatabaseSubmission | null>(null);
  const [submissions, setSubmissions] = useState<DatabaseSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load submissions on component mount and when filters change
  React.useEffect(() => {
    loadSubmissions();
  }, [selectedRole, selectedDateRange]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: any = {};
      
      if (selectedRole !== 'all') {
        filters.role = selectedRole;
      }
      
      // Calculate date range
      const now = new Date();
      switch (selectedDateRange) {
        case 'today':
          filters.dateFrom = now.toISOString().split('T')[0];
          filters.dateTo = now.toISOString().split('T')[0];
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filters.dateFrom = weekAgo.toISOString().split('T')[0];
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filters.dateFrom = monthAgo.toISOString().split('T')[0];
          break;
      }
      
      const data = await submissionService.getAll(filters);
      setSubmissions(data);
    } catch (err) {
      console.error('Error loading submissions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (selectedRole !== 'all' && submission.submission_type !== selectedRole) {
      return false;
    }
    
    const submissionDate = new Date(submission.submission_date);
    const now = new Date();
    
    switch (selectedDateRange) {
      case 'today':
        return submissionDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return submissionDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return submissionDate >= monthAgo;
      default:
        return true;
    }
  });

  const exportSubmissions = () => {
    const csv = [
      'ID,User Name,Role,Date,Submitted At,Data',
      ...filteredSubmissions.map(s => 
        `${s.id},${s.users?.name || 'Unknown'},${s.submission_type},${s.submission_date},${s.submitted_at},"${JSON.stringify(s.data).replace(/"/g, '""')}"`
      )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noblindspots-submissions-${selectedRole}-${selectedDateRange}.csv`;
    a.click();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'closer': return 'bg-green-100 text-green-800';
      case 'dm-setter': return 'bg-orange-100 text-orange-800';
      case 'phone-setter': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getKeyMetrics = (submission: DatabaseSubmission) => {
    const { data, submission_type } = submission;
    
    switch (submission_type) {
      case 'closer':
        return [
          { label: 'Calls Taken', value: data.discoveryCallsTaken || 0 },
          { label: 'Offers Made', value: data.offersMade || 0 },
          { label: 'Closes', value: data.totalCloses || 0 },
          { label: 'Revenue', value: `$${(data.revenueClosed || 0).toLocaleString()}` },
        ];
      case 'dm-setter':
        return [
          { label: 'DMs Sent', value: data.outboundIGDMsSent || 0 },
          { label: 'Replies', value: data.outboundIGDMsReplied || 0 },
          { label: 'Sets Taken', value: data.setsTaken || 0 },
          { label: 'Revenue', value: `$${(data.revenue || 0).toLocaleString()}` },
        ];
      case 'phone-setter':
        return [
          { label: 'Dials', value: data.totalDials || 0 },
          { label: 'Conversations', value: data.meaningfulConversations || 0 },
          { label: 'Sets', value: data.totalSets || 0 },
          { label: 'Revenue', value: `$${(data.revenue || 0).toLocaleString()}` },
        ];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <Layout title="All Submissions" subtitle="Loading submissions...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="All Submissions" 
      subtitle="View and manage all EOD form submissions"
      showExport
      onExport={exportSubmissions}
    >
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">Error: {error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="phone-setter">Phone Setters</option>
                <option value="dm-setter">DM Setters</option>
                <option value="closer">Closers</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{filteredSubmissions.length}</p>
              </div>
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Submissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submissions.filter(s => new Date(s.submission_date).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(submissions.map(s => s.user_id)).size}
                </p>
              </div>
              <User className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
              </div>
              <FileText className="w-8 h-8 text-secondary-600" />
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Metrics</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => {
                  const keyMetrics = getKeyMetrics(submission);
                  return (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{submission.users?.name || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(submission.submission_type)}`}>
                          {submission.submission_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(submission.submission_date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {keyMetrics.slice(0, 2).map((metric, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {metric.label}: {metric.value}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(submission.submitted_at), 'HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setViewingSubmission(submission)}
                          className="text-primary-600 hover:text-primary-900 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Submission Modal */}
      {viewingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {viewingSubmission.users?.name || 'Unknown'} - {format(new Date(viewingSubmission.submission_date), 'MMM dd, yyyy')}
              </h3>
              <button
                onClick={() => setViewingSubmission(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Role</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(viewingSubmission.submission_type)}`}>
                    {viewingSubmission.submission_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Submitted At</p>
                  <p className="text-sm text-gray-900">{format(new Date(viewingSubmission.submitted_at), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">All Metrics</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(viewingSubmission.data).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-xs text-gray-500">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                        <p className="text-sm font-medium text-gray-900">{value?.toString() || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewingSubmission(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AllSubmissions;