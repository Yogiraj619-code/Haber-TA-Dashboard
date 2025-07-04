import React from 'react';
import { AlertTriangle, Clock, UserX, Search } from 'lucide-react';

interface BottleneckSectionProps {
  bottlenecks: string[];
}

const BottleneckSection: React.FC<BottleneckSectionProps> = ({ bottlenecks }) => {
  const getBottleneckIcon = (bottleneck: string) => {
    if (bottleneck.toLowerCase().includes('feedback')) return <Clock className="w-4 h-4" />;
    if (bottleneck.toLowerCase().includes('panel')) return <UserX className="w-4 h-4" />;
    if (bottleneck.toLowerCase().includes('sourcing')) return <Search className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-400">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Bottlenecks</h3>
      </div>
      
      <div className="space-y-3">
        {bottlenecks.map((bottleneck, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <div className="text-orange-600">
              {getBottleneckIcon(bottleneck)}
            </div>
            <span className="text-sm text-orange-800">{bottleneck}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottleneckSection;