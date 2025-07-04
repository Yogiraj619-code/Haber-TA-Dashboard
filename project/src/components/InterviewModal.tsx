import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Users, Briefcase, Plus } from 'lucide-react';
import { Interview } from '../types';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (interview: Interview) => void;
  interview?: Interview | null;
  availableCandidates: string[];
  availableRoles: string[];
}

const InterviewModal: React.FC<InterviewModalProps> = ({
  isOpen,
  onClose,
  onSave,
  interview,
  availableCandidates,
  availableRoles
}) => {
  const [formData, setFormData] = useState<Interview>({
    id: '',
    candidateName: '',
    stage: 'L1 Screen',
    date: '',
    panel: [],
    roleTitle: ''
  });

  const [customPanelMember, setCustomPanelMember] = useState('');
  const [selectedPanelMembers, setSelectedPanelMembers] = useState<string[]>([]);

  const stages = ['L1 Screen', 'L2 Tech', 'Final', 'HR Round'];
  const availablePanelMembers = [
    'Yogiraj', 'Shambhavi', 'Maaz', 'Ishita', 'Priya', 'Rahul', 'Tech Lead', 
    'Senior Engineer', 'CEO', 'CTO', 'HR Manager', 'Ravi Kumar'
  ];

  useEffect(() => {
    if (interview) {
      setFormData(interview);
    } else {
      setFormData({
        id: '',
        candidateName: '',
        stage: 'L1 Screen',
        date: '',
        panel: [],
        roleTitle: ''
      });
    }
    setCustomPanelMember('');
    setSelectedPanelMembers([]);
  }, [interview, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePanelMemberToggle = (member: string) => {
    setSelectedPanelMembers(prev => {
      if (prev.includes(member)) {
        return prev.filter(m => m !== member);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleAddCustomPanelMember = () => {
    if (customPanelMember.trim() && !formData.panel.includes(customPanelMember.trim())) {
      setFormData(prev => ({
        ...prev,
        panel: [...prev.panel, customPanelMember.trim()]
      }));
      setCustomPanelMember('');
    }
  };

  const handleAddSelectedMembers = () => {
    const newMembers = selectedPanelMembers.filter(member => !formData.panel.includes(member));
    if (newMembers.length > 0) {
      setFormData(prev => ({
        ...prev,
        panel: [...prev.panel, ...newMembers]
      }));
      setSelectedPanelMembers([]);
    }
  };

  const handleRemovePanelMember = (memberToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      panel: prev.panel.filter(member => member !== memberToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomPanelMember();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.candidateName || !formData.roleTitle || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    const interviewToSave = {
      ...formData,
      id: interview?.id || Date.now().toString(),
      date: formData.date
    };
    
    onSave(interviewToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {interview ? 'Edit Interview' : 'Schedule New Interview'}
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
                <User className="w-4 h-4 inline mr-1" />
                Candidate *
              </label>
              <select
                name="candidateName"
                value={formData.candidateName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Candidate</option>
                {availableCandidates.map(candidate => (
                  <option key={candidate} value={candidate}>{candidate}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-1" />
                Role *
              </label>
              <select
                name="roleTitle"
                value={formData.roleTitle}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Role</option>
                {availableRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Stage *
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Interview Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Users className="w-4 h-4 inline mr-1" />
              Interview Panel
            </label>
            
            {/* Add Custom Panel Member */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Add Custom Panel Member</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPanelMember}
                  onChange={(e) => setCustomPanelMember(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter custom panel member name"
                  className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddCustomPanelMember}
                  disabled={!customPanelMember.trim() || formData.panel.includes(customPanelMember.trim())}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            {/* Select Multiple Predefined Panel Members */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">Select Multiple Panel Members</h4>
                {selectedPanelMembers.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAddSelectedMembers}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Selected ({selectedPanelMembers.length})
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {availablePanelMembers
                  .filter(member => !formData.panel.includes(member))
                  .map(member => (
                    <label
                      key={member}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors text-sm ${
                        selectedPanelMembers.includes(member)
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-white hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPanelMembers.includes(member)}
                        onChange={() => handlePanelMemberToggle(member)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="truncate">{member}</span>
                    </label>
                  ))}
              </div>
            </div>
            
            {/* Display Selected Panel Members */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-medium">
                Selected Panel Members ({formData.panel.length}):
              </p>
              {formData.panel.length === 0 ? (
                <p className="text-sm text-gray-400 italic bg-gray-50 p-3 rounded-lg">No panel members selected</p>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.panel.map((member, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2 border border-blue-200"
                      >
                        <Users className="w-3 h-3" />
                        {member}
                        <button
                          type="button"
                          onClick={() => handleRemovePanelMember(member)}
                          className="text-blue-600 hover:text-blue-800 ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                          title="Remove panel member"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {interview ? 'Update Interview' : 'Schedule Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewModal;