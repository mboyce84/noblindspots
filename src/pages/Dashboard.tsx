import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Phone, 
  Target,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  MessageCircle, 
  DollarSign,
  Users,
  Calendar,
  Award,
  Briefcase,
  CheckSquare,
  Clock
} from 'lucide-react';
import Layout from '../components/Layout/Layout';
import MetricCard from '../components/Dashboard/MetricCard';
import Chart from '../components/Dashboard/Chart';
import { useAuth } from '../context/AuthContext';
import { generateMockData, calculateKPIs } from '../utils/mockData';
import RoleDashboardSelector from '../components/Dashboard/RoleDashboardSelector';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [viewAsRole, setViewAsRole] = useState<string>(user?.role || 'admin');
  
  const data = generateMockData(viewAsRole);
  const kpis = calculateKPIs(viewAsRole, data);

  const exportData = () => {
    const csvData = data[timeRange].map(item => Object.values(item).join(',')).join('\n');
    const headers = Object.keys(data[timeRange][0] || {}).join(',');
    const csv = headers + '\n' + csvData;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${viewAsRole}-${timeRange}-data.csv`;
    a.click();
  };

  const getRoleSpecificMetrics = () => {
    if (viewAsRole === 'phone-setter') {
      return [
        { title: 'Outbound Dials', value: kpis.outboundDials || '0', icon: PhoneForwarded, color: 'primary' as const, change: '+2.3% from last week', changeType: 'positive' as const },
        { title: 'Meaningful Conversations', value: kpis.meaningfulConversations || '0', icon: Phone, color: 'secondary' as const, change: '+3.1% from last week', changeType: 'positive' as const },
        { title: 'Total Sets', value: kpis.totalSets || '0', icon: Target, color: 'accent' as const, change: '+5 from last week', changeType: 'positive' as const },
        { title: 'Sets Closed', value: kpis.setsClosed || '0', icon: CheckSquare, color: 'success' as const, change: '+2 from last week', changeType: 'positive' as const },
      ];
    }

    if (viewAsRole === 'closer') {
      return [
        { title: 'Call to Offer Rate', value: `${kpis.callToOfferRate}%`, icon: Target, color: 'secondary' as const, change: '+1.5% from last week', changeType: 'positive' as const },
        { title: 'Offer to Close Rate', value: `${kpis.offerToCloseRate}%`, icon: Award, color: 'success' as const, change: '+3.2% from last week', changeType: 'positive' as const },
        { title: 'Avg Revenue/Close', value: `$${kpis.avgRevenuePerClose}`, icon: DollarSign, color: 'accent' as const, change: '+$200 from last week', changeType: 'positive' as const },
        { title: 'Total Revenue', value: `$${kpis.totalRevenue}`, icon: TrendingUp, color: 'primary' as const, change: '+8.7% from last week', changeType: 'positive' as const },
      ];
    }

    if (viewAsRole === 'dm-setter') {
      return [
        { title: 'DM Response Rate', value: `${kpis.dmResponseRate}%`, icon: MessageCircle, color: 'accent' as const, change: '+1.8% from last week', changeType: 'positive' as const },
        { title: 'Reply to Call Rate', value: `${kpis.replyToCallRate}%`, icon: Phone, color: 'primary' as const, change: '+2.1% from last week', changeType: 'positive' as const },
        { title: 'Call to Set Rate', value: `${kpis.callToSetRate}%`, icon: Target, color: 'secondary' as const, change: '+0.5% from last week', changeType: 'positive' as const },
        { title: 'Total Sets', value: kpis.totalSets, icon: TrendingUp, color: 'success' as const, change: '+5 from last week', changeType: 'positive' as const },
      ];
    }

    // Admin metrics
    return [
      { title: 'Total Revenue', value: '$125,430', icon: DollarSign, color: 'success' as const, change: '+12.5% from last week', changeType: 'positive' as const },
      { title: 'Total Sets', value: '234', icon: Target, color: 'primary' as const, change: '+8.2% from last week', changeType: 'positive' as const },
      { title: 'Total Closes', value: '67', icon: Award, color: 'secondary' as const, change: '+15.3% from last week', changeType: 'positive' as const },
      { title: 'Team Members', value: '12', icon: Users, color: 'accent' as const, change: '+2 this month', changeType: 'positive' as const },
    ];
  };

  const getRoleSpecificCharts = () => {
    if (viewAsRole === 'phone-setter') {
      return [
        <Chart key="dials" data={data[timeRange]} type="bar" dataKey="dials" title="Daily Dials" color="#3B82F6" />,
        <Chart key="sets" data={data[timeRange]} type="line" dataKey="sets" title="Sets Over Time" color="#14B8A6" />,
        <Chart key="conversations" data={data[timeRange]} type="bar" dataKey="conversations" title="Meaningful Conversations" color="#8B5CF6" />,
        <Chart key="showRate" data={data[timeRange]} type="line" dataKey="showRate" title="Show Rate %" color="#F97316" />,
      ];
    }

    if (viewAsRole === 'closer') {
      return [
        <Chart key="calls" data={data[timeRange]} type="bar" dataKey="calls" title="Discovery Calls" color="#14B8A6" />,
        <Chart key="offers" data={data[timeRange]} type="line" dataKey="offers" title="Offers Made" color="#3B82F6" />,
        <Chart key="revenue" data={data[timeRange]} type="line" dataKey="revenue" title="Revenue Closed" color="#F97316" />,
      ];
    }

    if (viewAsRole === 'dm-setter') {
      return [
        <Chart key="dms" data={data[timeRange]} type="bar" dataKey="dmsSent" title="DMs Sent" color="#F97316" />,
        <Chart key="replies" data={data[timeRange]} type="line" dataKey="replies" title="Reply Rate" color="#14B8A6" />,
        <Chart key="sets" data={data[timeRange]} type="line" dataKey="sets" title="Sets Booked" color="#3B82F6" />,
      ];
    }

    // Admin charts
    return [
      <Chart key="revenue" data={data[timeRange]} type="line" dataKey="totalRevenue" title="Total Revenue" color="#10B981" />,
      <Chart key="sets" data={data[timeRange]} type="bar" dataKey="totalSets" title="Total Sets" color="#3B82F6" />,
    ];
  };

  const getPhoneSetterStats = () => {
    return (
      <div className="space-y-6 mb-6">
        {/* Main Phone Setter KPIs Grid */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PhoneForwarded className="w-5 h-5 mr-2 text-primary-600" />
            Phone Setter KPIs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Outbound Dials</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.outboundDials || '0'}</p>
              <p className="text-xs text-green-600 mt-1">+2.3% from last week</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Dial Response %</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.outboundDialResponseRate || '0'}%</p>
              <p className="text-xs text-green-600 mt-1">+3.1% from last week</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Meaningful Conversations</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.meaningfulConversations || '0'}</p>
              <p className="text-xs text-green-600 mt-1">+1.2% from last week</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Conversation Rate</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.meaningfulConversationRate || '0'}%</p>
              <p className="text-xs text-green-600 mt-1">+0.5 min from last week</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Inbound Sets</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.inboundSets || '0'}</p>
              <p className="text-xs text-green-600 mt-1">+1 from last week</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Outbound Sets</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.outboundSets || '0'}</p>
              <p className="text-xs text-green-600 mt-1">+3 from last week</p>
            </div>
          </div>
        </div>

        {/* Sets Performance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-secondary-600" />
              Sets Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Dial to Sets</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.dialToSets || '0'}%</p>
                <p className="text-xs text-green-600 mt-1">+0.8% from last week</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Total Sets</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.totalSets || '0'}</p>
                <p className="text-xs text-green-600 mt-1">+5 from last week</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Sets in Past</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.totalSetsInPast || '0'}</p>
                <p className="text-xs text-gray-500 mt-1">Previous period</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Sets Shown</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.setsShown || '0'}</p>
                <p className="text-xs text-green-600 mt-1">+3 from last week</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-accent-600" />
              Conversion Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Set Show Rate</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.setShowRate || '0'}%</p>
                <p className="text-xs text-green-600 mt-1">+2.1% from last week</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Set to Close %</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.setToCloseRate || '0'}%</p>
                <p className="text-xs text-green-600 mt-1">+1.5% from last week</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Showed to Close %</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.showedUpToCloseRate || '0'}%</p>
                <p className="text-xs text-green-600 mt-1">+0.8% from last week</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Sets Closed</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.setsClosed || '0'}</p>
                <p className="text-xs text-green-600 mt-1">+2 from last week</p>
              </div>
            </div>
          </div>
        </div>

        {/* AAV Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Average Appointment Value (AAV)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm font-medium text-gray-500 mb-2">AAV - Sets Scheduled</p>
              <p className="text-3xl font-bold text-gray-900">${kpis.aavSetsScheduled || '0'}</p>
              <p className="text-xs text-green-600 mt-1">+$120 from last week</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm font-medium text-gray-500 mb-2">AAV - Sets Showed</p>
              <p className="text-3xl font-bold text-gray-900">${kpis.aavSetsShowed || '0'}</p>
              <p className="text-xs text-green-600 mt-1">+$85 from last week</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getPhoneSetterBarCharts = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PhoneForwarded className="w-5 h-5 mr-2 text-primary-600" />
            Daily Dial Performance
          </h3>
          <Chart data={data[timeRange]} type="bar" dataKey="dials" title="Outbound Dials" color="#3B82F6" />
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-secondary-600" />
            Sets Conversion Funnel
          </h3>
          <div className="space-y-4">
            <Chart data={data[timeRange]} type="bar" dataKey="sets" title="Sets Booked" color="#14B8A6" />
            <Chart data={data[timeRange]} type="line" dataKey="showRate" title="Show Rate Trend" color="#F97316" />
          </div>
        </div>
      </div>
    );
  };

  const getSetterStats = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-secondary-600" />
            Set Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Total Sets</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalSets || '0'}</p>
              <p className="text-xs text-green-600 mt-1">+5 from last week</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Show Rate</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.showRate || '0'}%</p>
              <p className="text-xs text-green-600 mt-1">+2.1% from last week</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Set to Close</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.setToCloseRate || '0'}%</p>
              <p className="text-xs text-green-600 mt-1">+0.8% from last week</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Avg Set Value</p>
              <p className="text-2xl font-bold text-gray-900">${kpis.avgSetValue || '0'}</p>
              <p className="text-xs text-green-600 mt-1">+$120 from last week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PhoneCall className="w-5 h-5 mr-2 text-secondary-600" />
            Call Outcomes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Answered</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.answeredCalls || '0'}</p>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">65%</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Voicemail</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.voicemails || '0'}</p>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">20%</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">No Answer</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.noAnswers || '0'}</p>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">10%</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Wrong Number</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.wrongNumbers || '0'}</p>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-gray-500 h-1.5 rounded-full" style={{ width: '5%' }}></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const metrics = getRoleSpecificMetrics();
  const charts = getRoleSpecificCharts();

  return (
    <Layout 
      title={`${viewAsRole === 'admin' ? 'Executive' : 
        viewAsRole === 'phone-setter' ? 'Phone Setter' :
        viewAsRole === 'dm-setter' ? 'DM Setter' :
        viewAsRole === 'closer' ? 'Closer' : 'Executive'} Dashboard`}
      subtitle={`${viewAsRole === 'admin' ? 'Complete overview' : 'Performance metrics'} • ${new Date().toLocaleDateString()}`}
      showExport
      onExport={exportData}
    >
      <div className="space-y-6">
        {/* Admin Role Selector */}
        {user?.role === 'admin' && (
          <RoleDashboardSelector 
            currentRole={viewAsRole} 
            onRoleChange={setViewAsRole} 
          />
        )}

        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Time Range:</span>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['daily', 'weekly', 'monthly'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Phone Setter Specific Stats */}
        {viewAsRole === 'phone-setter' && getPhoneSetterStats()}

        {/* Phone Setter Performance Metrics Charts */}
        {viewAsRole === 'phone-setter' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics Across Phone Setters</h2>
            
            {/* First Row - 3 Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <Chart 
                  data={data.phoneSetterMetrics} 
                  type="bar" 
                  dataKey="newCash" 
                  title="New Cash Per Phone Setter" 
                  color="#3B82F6" 
                  height={250}
                />
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <Chart 
                  data={data.phoneSetterMetrics} 
                  type="bar" 
                  dataKey="totalCash" 
                  title="Total Cash Per Phone Setter" 
                  color="#3B82F6" 
                  height={250}
                />
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <Chart 
                  data={data.phoneSetterMetrics} 
                  type="bar" 
                  dataKey="newRevenue" 
                  title="New Revenue Per Phone Setter" 
                  color="#3B82F6" 
                  height={250}
                />
              </div>
            </div>
            
            {/* Second Row - 2 Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <Chart 
                  data={data.phoneSetterMetrics} 
                  type="bar" 
                  dataKey="newRevenuePerCall" 
                  title="New Revenue Per Call" 
                  color="#3B82F6" 
                  height={250}
                />
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <Chart 
                  data={data.phoneSetterMetrics} 
                  type="bar" 
                  dataKey="newRevenuePerShowedCall" 
                  title="New Revenue Per Showed Call" 
                  color="#3B82F6" 
                  height={250}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Setter Stats */}
        {(viewAsRole === 'phone-setter' || viewAsRole === 'dm-setter') && getSetterStats()}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {charts}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { time: '2 hours ago', action: 'EOD form submitted', status: 'success' },
              { time: '5 hours ago', action: 'New set booked', status: 'info' },
              { time: '1 day ago', action: 'Deal closed - $3,500', status: 'success' },
              { time: '2 days ago', action: 'Follow-up call scheduled', status: 'warning' },
              { time: '3 days ago', action: 'Team goal updated', status: 'info' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'info' ? 'bg-blue-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-sm text-gray-900">{activity.action}</span>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;