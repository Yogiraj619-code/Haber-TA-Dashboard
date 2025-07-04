import React from 'react';
import { X, User, Briefcase, Calendar, Edit, Trash2 } from 'lucide-react';
import { Attrition } from '../types';

interface AttritionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  attritions: Attrition[];
  onEdit: (attrition: Attrition) => void;
  onDelete: (attritionId: string) => void;
  onAdd: () => void;
}

const AttritionDetailsModal: React.FC<AttritionDetailsModalProps> = ({
  isOpen,
  onClose,
  attritions,
  onEdit,
  onDelete,
  onAdd
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Attrition Details - January 2025
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              Total attritions this month: <span className="font-semibold text-gray-900">{attritions.length}</span>
            </p>
            <button
              onClick={onAdd}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <User className="w-4 h-4" />
              Add Attrition
            </button>
          </div>

          <div className="overflow-y-auto max-h-96">
            {attritions.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No attritions recorded for this month</p>
                <button
                  onClick={onAdd}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Add First Attrition
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {attritions.map((attrition) => (
                  <div key={attrition.id} className="bg-gray-50 rounded-lg p-4 group hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-600" />
                          <h3 className="font-semibold text-gray-900">{attrition.name}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            <span>{attrition.role}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(attrition.exitDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button
                          onClick={() => onEdit(attrition)}
                          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          title="Edit attrition"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDelete(attrition.id)}
                          className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                          title="Delete attrition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttritionDetailsModal;