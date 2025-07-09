import React, { useRef, useEffect } from 'react';

export interface TextBlock {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
}

export interface ShapeObject {
  id: string;
  type: 'rectangle' | 'circle' | 'triangle' | 'arrow';
  x: number;
  y: number;
  color: string;
}

export interface MediaClip {
  id: string;
  name: string;
  type: 'video' | 'image' | 'audio';
  url: string;
}

interface EditorCanvasProps {
  selectedClip: MediaClip | null;
  textBlocks: TextBlock[];
  shapes: ShapeObject[];
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ selectedClip, textBlocks, shapes }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (selectedClip?.type === 'video' && videoRef.current) {
      videoRef.current.load();
    }
    if (selectedClip?.type === 'audio' && audioRef.current) {
      audioRef.current.load();
    }
  }, [selectedClip]);

  return (
    <div className="relative w-full h-[400px] bg-black border border-gray-700 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {!selectedClip ? (
          <p className="text-gray-500">Select or upload a clip to preview</p>
        ) : selectedClip.type === 'video' ? (
          <video
            ref={videoRef}
            controls
            className="w-full h-full object-contain rounded"
          >
            <source src={selectedClip.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : selectedClip.type === 'image' ? (
          <img
            src={selectedClip.url}
            alt={selectedClip.name}
            className="w-full h-full object-contain"
          />
        ) : selectedClip.type === 'audio' ? (
          <audio
            ref={audioRef}
            controls
            className="absolute bottom-4 left-4 right-4"
          >
            <source src={selectedClip.url} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        ) : null}
      </div>

      {/* Text overlays */}
      {textBlocks.map((block) => (
        <div
          key={block.id}
          style={{
            position: 'absolute',
            top: block.y,
            left: block.x,
            color: block.color,
            fontSize: `${block.fontSize}px`,
            fontWeight: 'bold',
            cursor: 'move',
          }}
          draggable
        >
          {block.text}
        </div>
      ))}

      {/* Shape overlays */}
      {shapes.map((shape) => (
        <div
          key={shape.id}
          style={{
            position: 'absolute',
            top: shape.y,
            left: shape.x,
            width: 80,
            height: 80,
            backgroundColor: shape.color,
            borderRadius: shape.type === 'circle' ? '50%' : '0%',
            clipPath:
              shape.type === 'triangle'
                ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                : shape.type === 'arrow'
                ? 'polygon(0% 45%, 70% 45%, 70% 30%, 100% 60%, 70% 90%, 70% 75%, 0% 75%)'
                : undefined,
          }}
          draggable
        />
      ))}
    </div>
  );
};

export default EditorCanvas;
