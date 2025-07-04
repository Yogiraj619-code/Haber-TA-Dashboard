import React, { useState, useEffect } from 'react';
import { X, Briefcase, User, Calendar, AlertCircle, Building, Plus } from 'lucide-react';
import { Role } from '../types';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Role) => void;
  role?: Role | null;
  taOwners: string[];
}

const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  role,
  taOwners
}) => {
  const [formData, setFormData] = useState<Role>({
    id: '',
    title: '',
    taOwner: '',
    status: 'Research',
    daysOpen: 0,
    pipelineCount: 0,
    interviews: 0,
    offerStatus: '',
    isCritical: false,
    function: ''
  });

  const [customFunction, setCustomFunction] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const statusOptions: Role['status'][] = ['Research', 'Sourcing', 'Going Slow', 'Discussions', 'Offer', 'Closed'];
  const functionOptions = ['Product', 'Engineering', 'People Ops', 'Business Ops', 'Marketing', 'Research and Development'];

  useEffect(() => {
    if (role) {
      setFormData(role);
      // Check if the role's function is not in the predefined list
      if (role.function && !functionOptions.includes(role.function)) {
        setCustomFunction(role.function);
        setShowCustomInput(true);
      } else {
        setCustomFunction('');
        setShowCustomInput(false);
      }
    } else {
      setFormData({
        id: '',
        title: '',
        taOwner: '',
        status: 'Research',
        daysOpen: 0,
        pipelineCount: 0,
        interviews: 0,
        offerStatus: '',
        isCritical: false,
        function: ''
      });
      setCustomFunction('');
      setShowCustomInput(false);
    }
  }, [role]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' 
        ? parseFloat(value) || 0 
        : type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : value
    }));
  };

  const handleFunctionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setShowCustomInput(true);
      setFormData(prev => ({ ...prev, function: customFunction }));
    } else {
      setShowCustomInput(false);
      setCustomFunction('');
      setFormData(prev => ({ ...prev, function: value }));
    }
  };

  const handleCustomFunctionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomFunction(value);
    setFormData(prev => ({ ...prev, function: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roleToSave = {
      ...formData,
      id: role?.id || Date.now().toString()
    };
    onSave(roleToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {role ? 'Edit Role' : 'Add New Role'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-1" />
                Role Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Function *
              </label>
              <select
                value={showCustomInput ? 'custom' : formData.function}
                onChange={handleFunctionChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Function</option>
                {functionOptions.map(func => (
                  <option key={func} value={func}>{func}</option>
                ))}
                <option value="custom">+ Add Custom Function</option>
              </select>
              
              {showCustomInput && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={customFunction}
                    onChange={handleCustomFunctionChange}
                    placeholder="Enter custom function name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                TA Owner *
              </label>
              <select
                name="taOwner"
                value={formData.taOwner}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select TA Owner</option>
                {taOwners.map(owner => (
                  <option key={owner} value={owner}>{owner}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Days Open
              </label>
              <input
                type="number"
                name="daysOpen"
                value={formData.daysOpen}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Number of days"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pipeline Count
              </label>
              <input
                type="number"
                name="pipelineCount"
                value={formData.pipelineCount}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Number of candidates"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interviews This Week
              </label>
              <input
                type="number"
                name="interviews"
                value={formData.interviews}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Number of interviews"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Status
              </label>
              <input
                type="text"
                name="offerStatus"
                value={formData.offerStatus}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 1 offer in draft, Offer accepted"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCritical"
              name="isCritical"
              checked={formData.isCritical}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isCritical" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Mark as Critical Role
            </label>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {role ? 'Update Role' : 'Add Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;