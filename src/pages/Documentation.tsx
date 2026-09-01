import React from 'react';
import Layout from '../components/Layout/Layout';
import { FileText, Users, BarChart2, Calendar, Target, MessageCircle, Phone, DollarSign, CheckSquare, HelpCircle, Download } from 'lucide-react';

const Documentation: React.FC = () => {
  return (
    <Layout
      title="Documentation"
      subtitle="Learn how to use the NoBlindSpots dashboard"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-primary-600" />
            Introduction
          </h2>
          <p className="text-gray-700 mb-4">
            NoBlindSpots tracks, manages, and visualizes key performance indicators for phone setters, DM setters, and closers. This documentation provides an overview of the system's features and how to use them effectively.
          </p>
          <p className="text-gray-700">
            The dashboard is designed to provide real-time insights into performance metrics, allowing team members and management to make data-driven decisions and track progress toward individual and team goals.
          </p>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <HelpCircle className="w-6 h-6 mr-2 text-primary-600" />
            Navigation
          </h2>
          <p className="text-gray-700 mb-4">
            The application consists of several key sections accessible from the sidebar:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border border-gray-200 rounded-lg p-4 flex items-start space-x-3">
              <BarChart2 className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Dashboard</h3>
                <p className="text-sm text-gray-600">View your performance metrics, charts, and recent activity.</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 flex items-start space-x-3">
              <FileText className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">EOD Form</h3>
                <p className="text-sm text-gray-600">Submit your end-of-day metrics and notes.</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 flex items-start space-x-3">
              <Target className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Team Goals</h3>
                <p className="text-sm text-gray-600">Set and track individual and team monthly goals.</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 flex items-start space-x-3">
              <Users className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Admin Panel</h3>
                <p className="text-sm text-gray-600">For admins: manage users, view all submissions, and track compliance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Role-Specific Features */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-primary-600" />
            Role-Specific Features
          </h2>
          <p className="text-gray-700 mb-4">
            The dashboard adapts to your role, showing relevant metrics and forms:
          </p>
          
          <div className="space-y-6 mt-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-blue-600" />
                Phone Setters
              </h3>
              <p className="text-gray-700 mt-2 mb-3">
                Phone setters can track metrics such as:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Dialing Activity</p>
                  <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
                    <li>Total dials</li>
                    <li>Conversations</li>
                    <li>Contact rate</li>
                    <li>Call outcomes</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Set Metrics</p>
                  <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
                    <li>Total sets</li>
                    <li>Show rate</li>
                    <li>Set to close rate</li>
                    <li>Average set value</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-orange-600" />
                DM Setters
              </h3>
              <p className="text-gray-700 mt-2 mb-3">
                DM setters can track metrics such as:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-orange-800">DM Activity</p>
                  <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
                    <li>DMs sent</li>
                    <li>Reply rate</li>
                    <li>Quality inbounds</li>
                    <li>Follow-ups</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-orange-800">Call Booking</p>
                  <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
                    <li>Calls proposed</li>
                    <li>Total calls booked</li>
                    <li>Sets scheduled</li>
                    <li>Sets taken</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Closers
              </h3>
              <p className="text-gray-700 mt-2 mb-3">
                Closers can track metrics such as:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Call Metrics</p>
                  <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
                    <li>Discovery calls booked</li>
                    <li>Discovery calls taken</li>
                    <li>Follow-up calls</li>
                    <li>Offers made</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Revenue Metrics</p>
                  <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
                    <li>Total closes</li>
                    <li>Revenue closed</li>
                    <li>Cash collected</li>
                    <li>PIFs/Payment plans</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Features */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <BarChart2 className="w-6 h-6 mr-2 text-primary-600" />
            Dashboard Features
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <CheckSquare className="w-5 h-5 mr-2 text-primary-600" />
                Key Metrics Cards
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                The dashboard displays key performance indicators specific to your role. These cards provide a quick overview of your most important metrics, with indicators showing changes from the previous period.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <BarChart2 className="w-5 h-5 mr-2 text-primary-600" />
                Interactive Charts
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                Visual representations of your performance data help identify trends and patterns. You can hover over data points to see specific values and toggle between daily, weekly, and monthly views.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                Time Range Selection
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                Switch between daily, weekly, and monthly views to analyze your performance over different time periods. This helps identify short-term fluctuations and long-term trends.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
                Team Goals Tracking
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                Set and track individual and team goals on a monthly basis. The system calculates progress percentages and provides visual indicators of goal achievement status.
              </p>
            </div>
          </div>
        </div>

        {/* EOD Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-primary-600" />
            EOD Form Submission
          </h2>
          <p className="text-gray-700 mb-4">
            The End-of-Day (EOD) form is a critical component of the system, allowing you to record your daily performance metrics. The form adapts based on your role, showing relevant fields for your position.
          </p>
          
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900">How to Submit Your EOD Form:</h3>
              <ol className="list-decimal list-inside text-gray-700 mt-2 space-y-2">
                <li>Navigate to the EOD Form page from the sidebar</li>
                <li>Verify the date is correct (defaults to today)</li>
                <li>Fill in all relevant metrics from your day's activities</li>
                <li>Add any qualitative feedback or notes in the provided text areas</li>
                <li>Click "Save EOD Form" to submit your data</li>
              </ol>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900">Important Notes:</h3>
              <ul className="list-disc list-inside text-gray-700 mt-2 space-y-2">
                <li>Forms should be submitted daily before the end of your workday</li>
                <li>You can edit your submission for the current day if needed</li>
                <li>Historical data can be viewed on your dashboard</li>
                <li>Admins can view all submissions and track compliance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Admin Features */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-primary-600" />
            Admin Features
          </h2>
          <p className="text-gray-700 mb-4">
            Administrators have access to additional features for managing the team and monitoring performance:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary-600" />
                User Management
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                Add, edit, and remove users from the system. Assign appropriate roles (Phone Setter, DM Setter, Closer, or Admin) to each team member.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary-600" />
                All Submissions
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                View and filter all EOD form submissions across the team. Export data to CSV for further analysis or reporting.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                EOD Compliance
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                Track which team members have submitted their EOD forms on time. View compliance rates and identify patterns of missed submissions.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <BarChart2 className="w-5 h-5 mr-2 text-primary-600" />
                Executive Dashboard
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                Access a high-level overview of team performance, including total revenue, sets, and closes across all team members.
              </p>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Download className="w-6 h-6 mr-2 text-primary-600" />
            Data Export
          </h2>
          <p className="text-gray-700 mb-4">
            The dashboard allows you to export data for further analysis or reporting:
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">Export Options:</h3>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-2">
              <li>Dashboard data can be exported as CSV by clicking the "Export CSV" button</li>
              <li>Admins can export user lists, submission data, and compliance reports</li>
              <li>Exported data can be imported into spreadsheet applications for further analysis</li>
            </ul>
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CheckSquare className="w-6 h-6 mr-2 text-primary-600" />
            Best Practices
          </h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-primary-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Daily EOD Submission</h3>
              <p className="text-sm text-gray-700 mt-1">
                Submit your EOD form every day before leaving to ensure accurate tracking and reporting. Consistent data entry helps identify trends and areas for improvement.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Set Realistic Goals</h3>
              <p className="text-sm text-gray-700 mt-1">
                When setting monthly goals, aim for targets that are challenging but achievable. Review past performance to establish realistic benchmarks.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Regular Dashboard Review</h3>
              <p className="text-sm text-gray-700 mt-1">
                Check your dashboard regularly to monitor your performance and identify areas for improvement. Use the time range selector to analyze trends over different periods.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-4 py-2">
              <h3 className="font-medium text-gray-900">Provide Detailed Notes</h3>
              <p className="text-sm text-gray-700 mt-1">
                When submitting your EOD form, include detailed notes about challenges, successes, and areas where you need support. This information helps managers provide targeted assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;