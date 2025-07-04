import React from 'react';
import { User, Building2, Calendar, IndianRupee, Target, FileText, Tag, Edit, Star } from 'lucide-react';
import { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  onEdit?: (candidate: Candidate) => void;
  onRatingChange?: (candidateId: string, rating: number) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onEdit, onRatingChange }) => {
  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'l1 screen':
        return 'bg-blue-100 text-blue-800';
      case 'l2 tech':
        return 'bg-purple-100 text-purple-800';
      case 'final':
        return 'bg-orange-100 text-orange-800';
      case 'offer released':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'offer released':
        return 'bg-green-500 text-white';
      case 'offer discussion':
        return 'bg-blue-500 text-white';
      case 'drop-off risk':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleRatingClick = (rating: number) => {
    if (onRatingChange) {
      onRatingChange(candidate.id, rating);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium text-gray-600 mr-1">Rating:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingClick(star)}
            className={`transition-colors hover:scale-110 transform ${
              candidate.rating && star <= candidate.rating
                ? 'text-yellow-500'
                : 'text-gray-300 hover:text-yellow-400'
            }`}
            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        ))}
        {candidate.rating && (
          <span className="text-xs text-gray-600 ml-1">({candidate.rating}/5)</span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 group">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center overflow-hidden">
          {candidate.photo ? (
            <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-blue-600" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{candidate.name}</h3>
            {onEdit && (
              <button
                onClick={() => onEdit(candidate)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                title="Edit candidate"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Building2 className="w-4 h-4" />
            <span>{candidate.company}</span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">{candidate.designation}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">
              <span className="font-medium">{candidate.experience} yrs</span> | 
              <span className="ml-1">Notice: {candidate.noticePeriod}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4 text-green-600" />
            <span className="text-gray-700">
              CTC: <span className="font-medium">₹{candidate.currentCTC} LPA</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">
              Exp: <span className="font-medium">₹{candidate.expectedCTC} LPA</span>
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="text-sm">
            <span className="font-medium text-gray-700">Role:</span> {candidate.role}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Stage:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(candidate.stage)}`}>
              {candidate.stage}
            </span>
          </div>
        </div>

        {/* Rating Section */}
        {onRatingChange && (
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            {renderStarRating()}
          </div>
        )}

        {candidate.notes && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-blue-900">Notes:</span>
                <p className="text-sm text-blue-800 mt-1">{candidate.notes}</p>
              </div>
            </div>
          </div>
        )}

        {candidate.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {candidate.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTagColor(tag)}`}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;