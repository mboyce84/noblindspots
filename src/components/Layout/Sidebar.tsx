import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  HelpCircle,
  Users, 
  Phone, 
  MessageCircle, 
  Settings,
  LogOut,
  Target,
  Calendar,
  Trophy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
      { path: '/eod-form', icon: FileText, label: 'EOD Form' },
      { path: '/team-goals', icon: Trophy, label: 'Team Goals' },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { path: '/admin/users', icon: Users, label: 'Manage Users' },
        { path: '/admin/all-submissions', icon: Target, label: 'All Submissions' },
        { path: '/admin/eod-compliance', icon: Calendar, label: 'EOD Compliance' },
        { path: '/documentation', icon: HelpCircle, label: 'Documentation' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
      ];
    }

    return [
      ...baseItems,
      { path: '/documentation', icon: HelpCircle, label: 'Documentation' },
    ];
  };

  const navigationItems = getNavigationItems();

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'phone-setter': return Phone;
      case 'dm-setter': return MessageCircle;
      case 'closer': return Target;
      default: return Users;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">NoBlindSpots</h1>
            <p className="text-sm text-gray-500">KPI Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary-500 rounded-full flex items-center justify-center">
            <RoleIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('-', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;