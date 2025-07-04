import React from 'react';
import { Calendar, Users, Edit, Trash2, Building } from 'lucide-react';
import { Interview } from '../types';

interface InterviewTableProps {
  interviews: Interview[];
  onEdit?: (interview: Interview) => void;
  onDelete?: (interviewId: string) => void;
  getRoleFunction?: (roleTitle: string) => string;
}

const InterviewTable: React.FC<InterviewTableProps> = ({ 
  interviews, 
  onEdit, 
  onDelete,
  getRoleFunction
}) => {
  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'l1 screen':
        return 'bg-blue-100 text-blue-800';
      case 'l2 tech':
        return 'bg-purple-100 text-purple-800';
      case 'final':
        return 'bg-orange-100 text-orange-800';
      case 'hr round':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFunctionColor = (func: string) => {
    switch (func?.toLowerCase()) {
      case 'product':
        return 'bg-purple-100 text-purple-800';
      case 'engineering':
        return 'bg-blue-100 text-blue-800';
      case 'people ops':
        return 'bg-green-100 text-green-800';
      case 'business ops':
        return 'bg-orange-100 text-orange-800';
      case 'marketing':
        return 'bg-pink-100 text-pink-800';
      case 'research and development':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Interviews This Week</h3>
        </div>
      </div>
      
      {interviews.length === 0 ? (
        <div className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No interviews scheduled this week</p>
          <p className="text-sm text-gray-400">Schedule interviews to see them here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Function
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Panel
                </th>
                {(onEdit || onDelete) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {interviews.map((interview) => {
                const roleFunction = getRoleFunction ? getRoleFunction(interview.roleTitle || '') : 'Unassigned';
                return (
                  <tr key={interview.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{interview.candidateName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{interview.roleTitle || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getFunctionColor(roleFunction)}`}>
                        <Building className="w-3 h-3 mr-1" />
                        {roleFunction}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(interview.stage)}`}>
                        {interview.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(interview.date)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-1">
                        <Users className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-900">
                          {interview.panel.length > 0 ? (
                            <div className="space-y-1">
                              {interview.panel.map((member, index) => (
                                <div key={index} className="flex items-center gap-1">
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                    {member}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">No panel assigned</span>
                          )}
                        </div>
                      </div>
                    </td>
                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(interview)}
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              title="Edit interview"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this interview?')) {
                                  onDelete(interview.id);
                                }
                              }}
                              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              title="Delete interview"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InterviewTable;