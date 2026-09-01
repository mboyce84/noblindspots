import React, { useState, useMemo } from 'react';
import { Calendar, CheckCircle, XCircle, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isAfter, isBefore, parseISO } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { submissionService, userService, DatabaseSubmission, DatabaseUser } from '../../lib/supabase';

interface ComplianceData {
  userId: string;
  userName: string;
  userRole: string;
  date: string;
  submitted: boolean;
  submittedAt?: string;
  isLate: boolean;
}

const EODCompliance: React.FC = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [submissions, setSubmissions] = useState<DatabaseSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount and when month/role changes
  React.useEffect(() => {
    loadData();
  }, [selectedMonth, selectedRole]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load users
      const usersData = await userService.getAll();
      // Filter out admin users for compliance tracking
      const nonAdminUsers = usersData.filter(u => u.role !== 'admin');
      setUsers(nonAdminUsers);
      
      // Load submissions for the selected month
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth() + 1;
      const submissionsData = await submissionService.getComplianceData(year, month, selectedRole);
      setSubmissions(submissionsData);
    } catch (err) {
      console.error('Error loading compliance data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load compliance data');
    } finally {
      setLoading(false);
    }
  };

  // Generate compliance data for the selected month
  const complianceData = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const data: ComplianceData[] = [];
    

    daysInMonth.forEach(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const isToday = isSameDay(day, new Date());
      const isPastDay = isBefore(day, new Date()) && !isToday;
      
      users.forEach(user => {
        // Check if user submitted for this day
        const submission = submissions.find(s => 
          s.user_id === user.id && s.submission_date === dayStr
        );
        
        let isLate = false;
        if (submission && submission.submitted_at) {
          // Check if submitted after midnight PST (assuming UTC timestamps)
          const submittedDate = parseISO(submission.submitted_at);
          const deadlineDate = new Date(day);
          deadlineDate.setHours(23, 59, 59, 999); // End of day PST
          isLate = isAfter(submittedDate, deadlineDate);
        }

        data.push({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          date: dayStr,
          submitted: !!submission,
          submittedAt: submission?.submitted_at,
          isLate: isPastDay && !submission ? true : isLate
        });
      });
    });

    return data;
  }, [selectedMonth, users, submissions]);

  // Filter data by role
  const filteredData = useMemo(() => {
    if (selectedRole === 'all') return complianceData;
    return complianceData.filter(d => d.userRole === selectedRole);
  }, [complianceData, selectedRole]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalExpected = filteredData.length;
    const totalSubmitted = filteredData.filter(d => d.submitted).length;
    const totalLate = filteredData.filter(d => d.isLate).length;
    const totalOnTime = filteredData.filter(d => d.submitted && !d.isLate).length;
    
    const complianceRate = totalExpected > 0 ? ((totalSubmitted / totalExpected) * 100) : 0;
    const onTimeRate = totalExpected > 0 ? ((totalOnTime / totalExpected) * 100) : 0;
    
    return {
      totalExpected,
      totalSubmitted,
      totalLate,
      totalOnTime,
      complianceRate: complianceRate.toFixed(1),
      onTimeRate: onTimeRate.toFixed(1)
    };
  }, [filteredData]);

  // Get calendar days for the selected month
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [selectedMonth]);

  // Get compliance status for a specific user and date
  const getComplianceStatus = (userId: string, date: string) => {
    const record = filteredData.find(d => d.userId === userId && d.date === date);
    if (!record) return 'no-data';
    
    const dayDate = parseISO(date);
    const isToday = isSameDay(dayDate, new Date());
    const isFutureDay = isAfter(dayDate, new Date());
    
    if (isFutureDay) return 'future';
    if (record.submitted && !record.isLate) return 'on-time';
    if (record.submitted && record.isLate) return 'late';
    if (!record.submitted && (isBefore(dayDate, new Date()) || isToday)) return 'missing';
    
    return 'no-data';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'bg-green-500';
      case 'late': return 'bg-yellow-500';
      case 'missing': return 'bg-red-500';
      case 'future': return 'bg-gray-200';
      default: return 'bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-time': return <CheckCircle className="w-4 h-4 text-white" />;
      case 'late': return <AlertTriangle className="w-4 h-4 text-white" />;
      case 'missing': return <XCircle className="w-4 h-4 text-white" />;
      default: return null;
    }
  };

  const exportCompliance = () => {
    const csvData = filteredData.map(record => ({
      Date: record.date,
      User: record.userName,
      Role: record.userRole,
      Status: record.submitted ? (record.isLate ? 'Late' : 'On Time') : 'Missing',
      'Submitted At': record.submittedAt || 'N/A'
    }));
    
    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eod-compliance-${format(selectedMonth, 'yyyy-MM')}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <Layout title="EOD Compliance Tracking" subtitle="Loading compliance data...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  // Only show to admin users
  if (user?.role !== 'admin') {
    return (
      <Layout title="Access Denied">
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">This page is only accessible to administrators.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="EOD Compliance Tracking" 
      subtitle="Monitor daily form submission compliance across all team members"
      showExport
      onExport={exportCompliance}
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

        {/* Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Month:</label>
                <input
                  type="month"
                  value={format(selectedMonth, 'yyyy-MM')}
                  onChange={(e) => setSelectedMonth(new Date(e.target.value + '-01'))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Role:</label>
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
            </div>

            {/* Legend */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>On Time</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Late</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Missing</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-200 rounded"></div>
                <span>Future</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Compliance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.complianceRate}%</p>
                <p className="text-xs text-gray-500">{stats.totalSubmitted} of {stats.totalExpected}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On-Time Rate</p>
                <p className="text-2xl font-bold text-green-600">{stats.onTimeRate}%</p>
                <p className="text-xs text-gray-500">{stats.totalOnTime} submissions</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Late Submissions</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.totalLate}</p>
                <p className="text-xs text-gray-500">After deadline</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Missing Reports</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalExpected - stats.totalSubmitted}</p>
                <p className="text-xs text-gray-500">Not submitted</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Compliance Calendar - {format(selectedMonth, 'MMMM yyyy')}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Track daily EOD form submissions by team member
            </p>
          </div>
          
          <div className="p-6">
            {/* Calendar Header */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="text-sm font-medium text-gray-700 p-2">Team Member</div>
              {calendarDays.slice(0, 7).map((day, index) => (
                <div key={index} className="text-xs font-medium text-gray-500 text-center p-2">
                  {format(day, 'EEE')}
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="space-y-2">
              {users
                .filter(user => selectedRole === 'all' || user.role === selectedRole)
                .map(user => (
                <div key={user.id} className="grid grid-cols-8 gap-2 items-center">
                  <div className="text-sm font-medium text-gray-900 p-2 truncate">
                    {user.name}
                    <div className="text-xs text-gray-500 capitalize">
                      {user.role.replace('-', ' ')}
                    </div>
                  </div>
                  
                  {calendarDays.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const status = getComplianceStatus(user.id, dateStr);
                    
                    return (
                      <div
                        key={dateStr}
                        className={`h-10 w-10 rounded-lg flex items-center justify-center ${getStatusColor(status)} relative group cursor-pointer`}
                        title={`${user.name} - ${format(day, 'MMM dd')}: ${status.replace('-', ' ')}`}
                      >
                        <span className="text-xs font-medium text-white">
                          {format(day, 'd')}
                        </span>
                        {getStatusIcon(status)}
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {user.name} - {format(day, 'MMM dd')}: {status.replace('-', ' ')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Show more days if month has more than 7 days */}
            {calendarDays.length > 7 && (
              <div className="mt-6">
                <div className="grid grid-cols-8 gap-2 mb-4">
                  <div></div>
                  {calendarDays.slice(7, 14).map((day, index) => (
                    <div key={index} className="text-xs font-medium text-gray-500 text-center p-2">
                      {format(day, 'EEE')}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  {users
                    .filter(user => selectedRole === 'all' || user.role === selectedRole)
                    .map(user => (
                    <div key={`${user.id}-week2`} className="grid grid-cols-8 gap-2 items-center">
                      <div></div>
                      {calendarDays.slice(7, 14).map(day => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const status = getComplianceStatus(user.id, dateStr);
                        
                        return (
                          <div
                            key={dateStr}
                            className={`h-10 w-10 rounded-lg flex items-center justify-center ${getStatusColor(status)} relative group cursor-pointer`}
                            title={`${user.name} - ${format(day, 'MMM dd')}: ${status.replace('-', ' ')}`}
                          >
                            <span className="text-xs font-medium text-white">
                              {format(day, 'd')}
                            </span>
                            {getStatusIcon(status)}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Continue for remaining weeks... */}
            {calendarDays.length > 14 && (
              <>
                {/* Week 3 */}
                <div className="mt-6">
                  <div className="grid grid-cols-8 gap-2 mb-4">
                    <div></div>
                    {calendarDays.slice(14, 21).map((day, index) => (
                      <div key={index} className="text-xs font-medium text-gray-500 text-center p-2">
                        {format(day, 'EEE')}
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    {users
                      .filter(user => selectedRole === 'all' || user.role === selectedRole)
                      .map(user => (
                      <div key={`${user.id}-week3`} className="grid grid-cols-8 gap-2 items-center">
                        <div></div>
                        {calendarDays.slice(14, 21).map(day => {
                          const dateStr = format(day, 'yyyy-MM-dd');
                          const status = getComplianceStatus(user.id, dateStr);
                          
                          return (
                            <div
                              key={dateStr}
                              className={`h-10 w-10 rounded-lg flex items-center justify-center ${getStatusColor(status)} relative group cursor-pointer`}
                              title={`${user.name} - ${format(day, 'MMM dd')}: ${status.replace('-', ' ')}`}
                            >
                              <span className="text-xs font-medium text-white">
                                {format(day, 'd')}
                              </span>
                              {getStatusIcon(status)}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Week 4+ */}
                {calendarDays.length > 21 && (
                  <div className="mt-6">
                    <div className="grid grid-cols-8 gap-2 mb-4">
                      <div></div>
                      {calendarDays.slice(21).map((day, index) => (
                        <div key={index} className="text-xs font-medium text-gray-500 text-center p-2">
                          {format(day, 'EEE')}
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      {users
                        .filter(user => selectedRole === 'all' || user.role === selectedRole)
                        .map(user => (
                        <div key={`${user.id}-week4`} className="grid grid-cols-8 gap-2 items-center">
                          <div></div>
                          {calendarDays.slice(21).map(day => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const status = getComplianceStatus(user.id, dateStr);
                            
                            return (
                              <div
                                key={dateStr}
                                className={`h-10 w-10 rounded-lg flex items-center justify-center ${getStatusColor(status)} relative group cursor-pointer`}
                                title={`${user.name} - ${format(day, 'MMM dd')}: ${status.replace('-', ' ')}`}
                              >
                                <span className="text-xs font-medium text-white">
                                  {format(day, 'd')}
                                </span>
                                {getStatusIcon(status)}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Detailed List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Compliance Report</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData
                  .filter(record => {
                    const dayDate = parseISO(record.date);
                    return !isAfter(dayDate, new Date()); // Only show past and current days
                  })
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 50) // Show last 50 records
                  .map((record, index) => {
                    const statusText = record.submitted ? (record.isLate ? 'Late' : 'On Time') : 'Missing';
                    const statusColor = record.submitted ? (record.isLate ? 'text-yellow-600' : 'text-green-600') : 'text-red-600';
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(parseISO(record.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {record.userRole.replace('-', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${statusColor}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.submittedAt ? format(parseISO(record.submittedAt), 'MMM dd, HH:mm') : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EODCompliance;