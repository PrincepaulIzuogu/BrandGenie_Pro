import React from 'react';

interface Clip {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  thumbnailUrl?: string;
}

interface VideoTimelineProps {
  clips: Clip[];
  onSelectClip: (clip: Clip) => void;
}

const VideoTimeline: React.FC<VideoTimelineProps> = ({ clips, onSelectClip }) => {
  return (
    <div className="w-full bg-gray-900 border-t border-gray-700 py-2 px-4 overflow-x-auto whitespace-nowrap flex space-x-4">
      {clips.length === 0 ? (
        <p className="text-sm text-gray-400">Upload media to see timeline</p>
      ) : (
        clips.map((clip) => (
          <div
            key={clip.id}
            className="flex-shrink-0 w-32 h-20 rounded bg-gray-800 hover:border-blue-400 border border-gray-700 cursor-pointer flex flex-col items-center justify-center text-white text-xs"
            onClick={() => onSelectClip(clip)}
          >
            {clip.thumbnailUrl ? (
              <img src={clip.thumbnailUrl} alt={clip.name} className="w-full h-12 object-cover rounded-t" />
            ) : (
              <div className="w-full h-12 flex items-center justify-center text-gray-500">
                {clip.type.toUpperCase()}
              </div>
            )}
            <span className="truncate px-1">{clip.name}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default VideoTimeline;
