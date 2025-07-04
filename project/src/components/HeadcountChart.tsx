import React, { useState } from 'react';
import { Users, TrendingUp, TrendingDown, Info, BarChart3, Edit } from 'lucide-react';

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

interface HeadcountChartProps {
  data: HeadcountData[];
  onEditMonth?: (data: HeadcountData) => void;
}

const HeadcountChart: React.FC<HeadcountChartProps> = ({ data, onEditMonth }) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  // Normalize month names and remove duplicates
  const normalizeMonth = (month: string) => {
    const monthMap: { [key: string]: string } = {
      'January': 'Jan',
      'February': 'Feb',
      'March': 'Mar',
      'April': 'Apr',
      'May': 'May',
      'June': 'Jun',
      'July': 'Jul',
      'August': 'Aug',
      'September': 'Sep',
      'October': 'Oct',
      'November': 'Nov',
      'December': 'Dec'
    };

    for (const [full, short] of Object.entries(monthMap)) {
      if (month.startsWith(full)) {
        return month.replace(full, short);
      }
    }
    
    return month;
  };

  // Remove duplicates by normalizing month names first
  const uniqueData = data.reduce((acc: HeadcountData[], current) => {
    const normalizedMonth = normalizeMonth(current.month);
    const existingIndex = acc.findIndex(item => normalizeMonth(item.month) === normalizedMonth);
    
    if (existingIndex === -1) {
      acc.push({
        ...current,
        month: normalizedMonth
      });
    }
    
    return acc;
  }, []);

  // Sort data chronologically by month
  const sortedData = [...uniqueData].sort((a, b) => {
    const parseMonth = (monthStr: string) => {
      const [month, year] = monthStr.split("'");
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = monthNames.indexOf(month);
      return new Date(2000 + parseInt(year), monthIndex);
    };
    
    return parseMonth(a.month).getTime() - parseMonth(b.month).getTime();
  });

  // Find max headcount for scaling - reduced chart height to accommodate details
  const maxHeadcount = Math.max(...sortedData.map(d => d.existingHeadcount + Math.max(d.newJoinees, d.expectedJoiners)));
  const chartHeight = 180; // Reduced from 200 to 180 for better proportions

  const getBarHeight = (value: number) => (value / maxHeadcount) * chartHeight;

  // Minimum height for visibility of small segments
  const getMinimumSegmentHeight = (value: number) => {
    if (value === 0) return 0;
    const calculatedHeight = getBarHeight(value);
    return Math.max(calculatedHeight, 25); // Minimum 25px height for visibility
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      {/* Header Section - Moved to very top */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Overall Headcount</h1>
        </div>
        <div className="flex items-center gap-3 text-blue-600">
          <img 
            src="/haber_tech_logo.jpg" 
            alt="Haber Tech Logo" 
            className="w-10 h-10 object-contain"
          />
          <span className="text-xl font-bold">HABER</span>
        </div>
      </div>

      {/* Chart Container with much more spacing */}
      <div className="relative mt-32">
        {/* Stacked Bar Chart */}
        <div className="flex items-end justify-between gap-4 mb-6" style={{ height: chartHeight + 200 }}>
          {sortedData.map((month, index) => {
            const existingHeight = getBarHeight(month.existingHeadcount);
            const newJoinersHeight = getMinimumSegmentHeight(month.newJoinees);
            const exitsHeight = getMinimumSegmentHeight(month.exits);
            const expectedHeight = getMinimumSegmentHeight(month.expectedJoiners);

            return (
              <div key={`${month.month}-${index}`} className="flex-1 flex flex-col items-center relative">
                {/* Details Section - Moved further down */}
                <div className="absolute -top-48 left-1/2 transform -translate-x-1/2 w-full max-w-52 text-center">
                  <div className="space-y-3 text-xs">
                    {/* New Joiners */}
                    {month.newJoinees > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="font-semibold text-green-800 mb-1">
                          New Joiners: {month.newJoinees}
                        </div>
                        <div className="text-green-700 text-xs leading-tight">
                          {month.joinerNames}
                        </div>
                      </div>
                    )}
                    
                    {/* Exits */}
                    {month.exits > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="font-semibold text-orange-800 mb-1">
                          Exits: {month.exits}
                        </div>
                        <div className="text-orange-700 text-xs leading-tight">
                          {month.exiterNames}
                        </div>
                      </div>
                    )}
                    
                    {/* Expected Joiners */}
                    {month.expectedJoiners > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="font-semibold text-blue-800 mb-1">
                          Expected: {month.expectedJoiners}
                        </div>
                        <div className="text-blue-700 text-xs leading-tight">
                          {month.expectedJoinerRoles}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chart Section with Numbers Beside */}
                <div className="flex items-end gap-4">
                  {/* Numbers Column */}
                  <div className="flex flex-col justify-end space-y-2 text-sm font-bold" style={{ height: chartHeight }}>
                    {/* Expected Joiners Number */}
                    {month.expectedJoiners > 0 && (
                      <div 
                        className="text-blue-600 bg-blue-100 px-2 py-1 rounded text-center"
                        style={{ 
                          marginBottom: existingHeight + newJoinersHeight + exitsHeight - 20
                        }}
                      >
                        {month.expectedJoiners}
                      </div>
                    )}
                    
                    {/* Exits Number */}
                    {month.exits > 0 && (
                      <div 
                        className="text-orange-600 bg-orange-100 px-2 py-1 rounded text-center"
                        style={{ 
                          marginBottom: existingHeight + newJoinersHeight - 20
                        }}
                      >
                        {month.exits}
                      </div>
                    )}
                    
                    {/* New Joiners Number */}
                    {month.newJoinees > 0 && (
                      <div 
                        className="text-green-600 bg-green-100 px-2 py-1 rounded text-center"
                        style={{ 
                          marginBottom: existingHeight - 20
                        }}
                      >
                        {month.newJoinees}
                      </div>
                    )}
                  </div>

                  {/* Stacked Bar */}
                  <div 
                    className="relative w-full bg-gray-100 rounded-lg overflow-hidden max-w-20"
                    style={{ height: chartHeight }}
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => {
                      setHoveredBar(null);
                      setHoveredSegment(null);
                    }}
                  >
                    {/* Existing Headcount (Base - Light Blue) */}
                    <div 
                      className="absolute bottom-0 w-full bg-blue-200 transition-all duration-200"
                      style={{ height: existingHeight }}
                    />
                    
                    {/* New Joiners (Green) */}
                    {month.newJoinees > 0 && (
                      <div 
                        className="absolute w-full bg-green-400 transition-all duration-200 hover:bg-green-500"
                        style={{ 
                          height: newJoinersHeight,
                          bottom: existingHeight
                        }}
                      />
                    )}
                    
                    {/* Exits (Orange) */}
                    {month.exits > 0 && (
                      <div 
                        className="absolute w-full bg-orange-400 transition-all duration-200 hover:bg-orange-500"
                        style={{ 
                          height: exitsHeight,
                          bottom: existingHeight + newJoinersHeight
                        }}
                      />
                    )}
                    
                    {/* Expected Joiners (Bright Blue) */}
                    {month.expectedJoiners > 0 && (
                      <div 
                        className="absolute w-full bg-blue-500 transition-all duration-200 hover:bg-blue-600"
                        style={{ 
                          height: expectedHeight,
                          bottom: existingHeight + newJoinersHeight + exitsHeight
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Total Headcount */}
                <div className="text-2xl font-bold text-blue-900 mt-4">
                  {month.existingHeadcount}
                </div>
                
                {/* Month Label */}
                <div className="text-lg font-medium text-gray-700 mt-2">
                  {month.month}
                </div>

                {/* Edit Button - Icon Only */}
                {onEditMonth && (
                  <button
                    onClick={() => onEditMonth(month)}
                    className="mt-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title={`Edit data for ${month.month}`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 justify-center text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 rounded-full"></div>
            <span>Existing HC</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Expected Joiners</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            <span>New Joiners</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
            <span>Exits</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadcountChart;