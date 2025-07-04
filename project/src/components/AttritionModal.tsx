import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Calendar } from 'lucide-react';
import { Attrition } from '../types';

interface AttritionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (attrition: Attrition) => void;
  attrition?: Attrition | null;
}

const AttritionModal: React.FC<AttritionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  attrition
}) => {
  const [formData, setFormData] = useState<Attrition>({
    id: '',
    name: '',
    role: '',
    exitDate: ''
  });

  useEffect(() => {
    if (attrition) {
      setFormData(attrition);
    } else {
      setFormData({
        id: '',
        name: '',
        role: '',
        exitDate: ''
      });
    }
  }, [attrition]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const attritionToSave = {
      ...formData,
      id: attrition?.id || Date.now().toString()
    };
    onSave(attritionToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {attrition ? 'Edit Attrition' : 'Add Attrition'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Employee Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter employee name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 inline mr-1" />
              Role *
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter role/designation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Exit Date *
            </label>
            <input
              type="date"
              name="exitDate"
              value={formData.exitDate}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {attrition ? 'Update Attrition' : 'Add Attrition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttritionModal;