import React from 'react';
import { Users, Phone, MessageCircle, Target } from 'lucide-react';

interface RoleDashboardSelectorProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

const RoleDashboardSelector: React.FC<RoleDashboardSelectorProps> = ({ 
  currentRole, 
  onRoleChange 
}) => {
  const roles = [
    { id: 'admin', name: 'Executive', icon: Users },
    { id: 'phone-setter', name: 'Phone Setter', icon: Phone },
    { id: 'dm-setter', name: 'DM Setter', icon: MessageCircle },
    { id: 'closer', name: 'Closer', icon: Target }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
        <Users className="w-4 h-4 mr-2 text-primary-600" />
        View Dashboard As:
      </h3>
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => onRoleChange(role.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentRole === role.id
                  ? 'bg-primary-100 text-primary-800 border border-primary-300'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{role.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleDashboardSelector;