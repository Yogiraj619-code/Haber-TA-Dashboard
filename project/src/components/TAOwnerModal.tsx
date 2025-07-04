import React, { useState, useEffect } from 'react';
import { X, User, Plus, Trash2 } from 'lucide-react';

interface TAOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (owners: string[]) => void;
  owners: string[];
}

const TAOwnerModal: React.FC<TAOwnerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  owners
}) => {
  const [ownerList, setOwnerList] = useState<string[]>([]);
  const [newOwner, setNewOwner] = useState('');

  useEffect(() => {
    setOwnerList([...owners]);
  }, [owners]);

  const handleAddOwner = () => {
    if (newOwner.trim() && !ownerList.includes(newOwner.trim())) {
      setOwnerList(prev => [...prev, newOwner.trim()]);
      setNewOwner('');
    }
  };

  const handleRemoveOwner = (ownerToRemove: string) => {
    setOwnerList(prev => prev.filter(owner => owner !== ownerToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(ownerList);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOwner();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Manage TA Owners
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
              Add New TA Owner
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter TA owner name"
              />
              <button
                type="button"
                onClick={handleAddOwner}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current TA Owners
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {ownerList.map((owner, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                  <span className="text-sm text-gray-900">{owner}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOwner(owner)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-red-600 text-white rounded hover:bg-red-700"
                    title="Remove owner"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {ownerList.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No TA owners added yet
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TAOwnerModal;