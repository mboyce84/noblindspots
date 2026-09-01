import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Bell, Shield, Database, Globe } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    // General Settings
    companyName: 'NoBlindSpots',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    
    // Notification Settings
    emailNotifications: true,
    eodReminders: true,
    goalAlerts: true,
    complianceAlerts: true,
    
    // Security Settings
    sessionTimeout: 480, // minutes
    passwordExpiry: 90, // days
    twoFactorAuth: false,
    
    // Dashboard Settings
    defaultTimeRange: 'weekly',
    autoRefresh: true,
    refreshInterval: 300, // seconds
    
    // EOD Form Settings
    eodDeadline: '23:59',
    allowLateSubmissions: true,
    requireNotes: false,
  });

  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Only show to admin users
  if (user?.role !== 'admin') {
    return (
      <Layout title="Access Denied">
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">This page is only accessible to administrators.</p>
        </div>
      </Layout>
    );
  }

  const handleSave = async () => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'dashboard', name: 'Dashboard', icon: SettingsIcon },
    { id: 'eod', name: 'EOD Forms', icon: Database },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => handleSettingChange('companyName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange('timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
          <select
            value={settings.dateFormat}
            onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={settings.currency}
            onChange={(e) => handleSettingChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-500">Receive email notifications for important events</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">EOD Reminders</h4>
            <p className="text-sm text-gray-500">Send reminders for EOD form submissions</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.eodReminders}
              onChange={(e) => handleSettingChange('eodReminders', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Goal Alerts</h4>
            <p className="text-sm text-gray-500">Notifications when goals are achieved or missed</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.goalAlerts}
              onChange={(e) => handleSettingChange('goalAlerts', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Compliance Alerts</h4>
            <p className="text-sm text-gray-500">Alerts for compliance issues and missed submissions</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.complianceAlerts}
              onChange={(e) => handleSettingChange('complianceAlerts', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="30"
            max="1440"
          />
          <p className="text-xs text-gray-500 mt-1">Users will be logged out after this period of inactivity</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
          <input
            type="number"
            value={settings.passwordExpiry}
            onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="30"
            max="365"
          />
          <p className="text-xs text-gray-500 mt-1">Users must change passwords after this period</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.twoFactorAuth}
            onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
    </div>
  );

  const renderDashboardSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Default Time Range</label>
          <select
            value={settings.defaultTimeRange}
            onChange={(e) => handleSettingChange('defaultTimeRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Auto Refresh Interval (seconds)</label>
          <input
            type="number"
            value={settings.refreshInterval}
            onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="60"
            max="3600"
            disabled={!settings.autoRefresh}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Auto Refresh</h4>
          <p className="text-sm text-gray-500">Automatically refresh dashboard data</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoRefresh}
            onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>
    </div>
  );

  const renderEODSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">EOD Deadline</label>
          <input
            type="time"
            value={settings.eodDeadline}
            onChange={(e) => handleSettingChange('eodDeadline', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Daily deadline for EOD form submissions</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Allow Late Submissions</h4>
            <p className="text-sm text-gray-500">Allow users to submit EOD forms after the deadline</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowLateSubmissions}
              onChange={(e) => handleSettingChange('allowLateSubmissions', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Require Notes</h4>
            <p className="text-sm text-gray-500">Make performance notes mandatory in EOD forms</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.requireNotes}
              onChange={(e) => handleSettingChange('requireNotes', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'dashboard':
        return renderDashboardSettings();
      case 'eod':
        return renderEODSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <Layout 
      title="Settings" 
      subtitle="Configure system settings and preferences"
    >
      <div className="space-y-6">
        {/* Settings Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Settings Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              saveStatus === 'saving'
                ? 'bg-gray-400 cursor-not-allowed'
                : saveStatus === 'saved'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-primary-600 hover:bg-primary-700 transform hover:scale-105'
            } text-white`}
          >
            <Save className="w-4 h-4" />
            <span>
              {saveStatus === 'saving' ? 'Saving...' : 
               saveStatus === 'saved' ? 'Saved!' : 
               'Save Settings'}
            </span>
          </button>
        </div>

        {/* Settings Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <SettingsIcon className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Settings Information</h3>
              <p className="text-sm text-blue-700 mt-1">
                Changes to these settings will affect all users of the system. Some changes may require users to log out and log back in to take effect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;