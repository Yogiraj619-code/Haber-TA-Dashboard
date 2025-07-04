import React from 'react';
import { BarChart3, AlertCircle, Users, Calendar, Edit, Trash2, Building } from 'lucide-react';
import { Role } from '../types';

interface OverviewTableProps {
  roles: Role[];
  onEdit?: (role: Role) => void;
  onDelete?: (roleId: string) => void;
}

const OverviewTable: React.FC<OverviewTableProps> = ({ roles, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'research':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'sourcing':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'going slow':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'discussions':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'offer':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getFunctionColor = (func: string) => {
    switch (func?.toLowerCase()) {
      case 'product':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'engineering':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'people ops':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'business ops':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'marketing':
        return 'bg-pink-100 text-pink-800 border border-pink-200';
      case 'research and development':
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      default:
        // For custom functions, use a distinct color scheme
        return 'bg-teal-100 text-teal-800 border border-teal-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">All Roles - Overview</h3>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Function
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TA Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Days Open
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pipeline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interviews
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Offer Status
              </th>
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.map((role) => (
              <tr 
                key={role.id} 
                className="hover:bg-gray-50 transition-colors duration-200 group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-900">{role.title}</div>
                    {role.isCritical && (
                      <AlertCircle className="w-4 h-4 text-amber-600" title="Critical Role" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getFunctionColor(role.function || '')}`}>
                    <Building className="w-3 h-3 mr-1" />
                    {role.function || 'Unassigned'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{role.taOwner}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(role.status)}`}>
                    {role.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {role.status === 'Closed' ? '-' : `${role.daysOpen} days`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-900">
                      {role.status === 'Closed' ? '-' : role.pipelineCount}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-900">
                      {role.status === 'Closed' ? '-' : `${role.interviews} this week`}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {role.offerStatus || '-'}
                  </div>
                </td>
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(role)}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          title="Edit role"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the role "${role.title}"?`)) {
                              onDelete(role.id);
                            }
                          }}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          title="Delete role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverviewTable;