import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Briefcase } from 'lucide-react';
import { Bottleneck } from '../types';

interface BottleneckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bottleneck: Bottleneck) => void;
  bottleneck?: Bottleneck | null;
  availableRoles: string[];
}

const BottleneckModal: React.FC<BottleneckModalProps> = ({
  isOpen,
  onClose,
  onSave,
  bottleneck,
  availableRoles
}) => {
  const [formData, setFormData] = useState<Bottleneck>({
    id: '',
    description: '',
    roleTitle: ''
  });

  const commonBottlenecks = [
    'Feedback delay from hiring managers',
    'Panel unavailable for critical roles',
    'Low sourcing for specialized positions',
    'Candidate drop-off during process',
    'Salary expectations mismatch',
    'Long notice periods',
    'Interview scheduling conflicts',
    'Slow decision making process'
  ];

  useEffect(() => {
    if (bottleneck) {
      setFormData(bottleneck);
    } else {
      setFormData({
        id: '',
        description: '',
        roleTitle: ''
      });
    }
  }, [bottleneck]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.trim() && formData.roleTitle) {
      const bottleneckToSave = {
        ...formData,
        id: bottleneck?.id || Date.now().toString()
      };
      onSave(bottleneckToSave);
      onClose();
    }
  };

  const handleSelectCommon = (selectedBottleneck: string) => {
    setFormData(prev => ({
      ...prev,
      description: selectedBottleneck
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {bottleneck ? 'Edit Bottleneck' : 'Add New Bottleneck'}
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
              <Briefcase className="w-4 h-4 inline mr-1" />
              Related Role *
            </label>
            <select
              name="roleTitle"
              value={formData.roleTitle}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a role</option>
              {availableRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              Bottleneck Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the bottleneck or issue..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Common Bottlenecks
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {commonBottlenecks.map((common, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectCommon(common)}
                  className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {common}
                </button>
              ))}
            </div>
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
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              {bottleneck ? 'Update Bottleneck' : 'Add Bottleneck'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BottleneckModal;