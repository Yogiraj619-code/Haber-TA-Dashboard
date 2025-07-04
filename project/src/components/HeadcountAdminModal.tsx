import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, UserPlus, UserMinus, Save, Plus } from 'lucide-react';

interface HeadcountData {
  id?: string;
  month: string;
  existingHeadcount: number;
  newJoinees: number;
  joinerNames: string;
  exits: number;
  exiterNames: string;
  expectedJoiners: number;
  expectedJoinerRoles: string;
}

interface HeadcountAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: HeadcountData) => void;
  data?: HeadcountData | null;
  existingMonths: string[];
}

const HeadcountAdminModal: React.FC<HeadcountAdminModalProps> = ({
  isOpen,
  onClose,
  onSave,
  data,
  existingMonths
}) => {
  const [formData, setFormData] = useState<HeadcountData>({
    month: '',
    existingHeadcount: 0,
    newJoinees: 0,
    joinerNames: '',
    exits: 0,
    exiterNames: '',
    expectedJoiners: 0,
    expectedJoinerRoles: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      setFormData({
        month: '',
        existingHeadcount: 0,
        newJoinees: 0,
        joinerNames: '',
        exits: 0,
        exiterNames: '',
        expectedJoiners: 0,
        expectedJoinerRoles: ''
      });
    }
    setShowSuccess(false);
  }, [data, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'existingHeadcount' || name === 'newJoinees' || name === 'exits' || name === 'expectedJoiners') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate month format and uniqueness
    if (!formData.month.trim()) {
      alert('Please enter a month');
      return;
    }

    if (!data && existingMonths.includes(formData.month)) {
      alert('This month already exists. Please edit the existing record or choose a different month.');
      return;
    }

    try {
      await onSave(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving headcount data:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {data ? 'Edit Headcount Data' : 'Add New Headcount Data'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {showSuccess && (
          <div className="mx-6 mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>✅ Data saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Month */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Month *
            </label>
            <input
              type="text"
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              required
              placeholder="e.g., Mar'25, Apr'25"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Format: Mar'25, Apr'25, etc.</p>
          </div>

          {/* Existing Headcount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Existing Headcount *
            </label>
            <input
              type="number"
              name="existingHeadcount"
              value={formData.existingHeadcount}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* New Joiners Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserPlus className="w-4 h-4 inline mr-1" />
                New Joinees *
              </label>
              <input
                type="number"
                name="newJoinees"
                value={formData.newJoinees}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Joiner Names
              </label>
              <textarea
                name="joinerNames"
                value={formData.joinerNames}
                onChange={handleInputChange}
                rows={2}
                placeholder="Comma-separated names"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Exits Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserMinus className="w-4 h-4 inline mr-1" />
                Exits *
              </label>
              <input
                type="number"
                name="exits"
                value={formData.exits}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exiter Names
              </label>
              <textarea
                name="exiterNames"
                value={formData.exiterNames}
                onChange={handleInputChange}
                rows={2}
                placeholder="Comma-separated names"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Expected Joiners Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Plus className="w-4 h-4 inline mr-1" />
                Expected Joiners *
              </label>
              <input
                type="number"
                name="expectedJoiners"
                value={formData.expectedJoiners}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Joiner Roles
              </label>
              <textarea
                name="expectedJoinerRoles"
                value={formData.expectedJoinerRoles}
                onChange={handleInputChange}
                rows={2}
                placeholder="Comma-separated roles"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Form Actions */}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {data ? 'Update Data' : 'Save Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeadcountAdminModal;