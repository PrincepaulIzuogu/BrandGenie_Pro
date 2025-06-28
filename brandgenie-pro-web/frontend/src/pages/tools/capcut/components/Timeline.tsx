import React from 'react';

interface TimelineProps {
  timelineTracks: Array<{
    id: string;
    type: 'video' | 'audio' | 'image' | 'text';
    label: string;
  }>;
}

const Timeline: React.FC<TimelineProps> = ({ timelineTracks }) => {
  return (
    <div className="flex flex-col h-48 overflow-x-auto bg-gray-100 border-t border-gray-300">
      {timelineTracks.map((track) => (
        <div
          key={track.id}
          className="flex items-center space-x-2 px-4 py-2 border-b border-gray-200 bg-white hover:bg-gray-50"
        >
          <div className="text-xs font-medium text-gray-600 w-24 capitalize">{track.type}</div>
          <div className="flex-1 h-6 bg-blue-200 rounded-md text-xs flex items-center justify-center">
            {track.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
