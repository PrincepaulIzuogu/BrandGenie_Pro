import React, { useEffect, useState } from 'react';
import Sidebar, { TabName } from './components/Sidebar';
import UploadPanel from './components/UploadPanel';
import EditorCanvas from './components/EditorCanvas';
import TextTool, { TextBlock } from './components/TextTool';
import ShapeModal, { ShapeType } from './components/ShapeModal';
import ToolControls from './components/ToolControls';

import CutModal from './components/CutModal';
import CropModal from './components/CropModal';
import FilterModal from './components/FilterModal';
import AdjustModal from './components/AdjustModal';
import AudioModal from './components/AudioModal';
import SaveModal from './components/SaveModal';

export interface Clip {
  id: string;
  name: string;
  url: string;
  type: 'video' | 'image' | 'audio';
}

const CapcutEditorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('Media');
  const [clips, setClips] = useState<Clip[]>([]);
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [shapes, setShapes] = useState<any[]>([]);
  const [showShapeModal, setShowShapeModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'cut' | 'text' | 'filter' | 'crop' | 'adjust' | 'audio' | 'save' | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('uploadedMedia');
    if (stored) {
      const parsed: Clip[] = JSON.parse(stored);
      setClips(parsed);
      if (parsed.length > 0) setSelectedClip(parsed[0]);
    }
  }, []);

  // Handle uploads
  const handleUpload = (uploaded: Omit<Clip, 'id'>[]) => {
    const updated: Clip[] = uploaded.map((f) => ({
      ...f,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
    }));
    const newClips = [...clips, ...updated];
    setClips(newClips);
    setSelectedClip(updated[0]);
    localStorage.setItem('uploadedMedia', JSON.stringify(newClips));
  };

  const closeModal = () => setSelectedTool(null);

  const handleSaveProject = () => {
    alert('Project saved! (This is a placeholder)');
    closeModal();
  };

  const handleDeleteClip = (clipId: string) => {
  const updatedClips = clips.filter((clip) => clip.id !== clipId);
  setClips(updatedClips);
  localStorage.setItem('uploadedMedia', JSON.stringify(updatedClips));

  if (selectedClip?.id === clipId) {
    setSelectedClip(updatedClips.length > 0 ? updatedClips[0] : null);
  }
};


  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Toolbar */}
        <ToolControls selectedTool={selectedTool} onSelectTool={setSelectedTool} />

        {selectedClip && (
  <div className="flex items-center justify-between px-6 py-2 bg-gray-700 text-white text-sm">
    <span>Now Editing: {selectedClip.name}</span>
    <button
      onClick={() => handleDeleteClip(selectedClip.id)}
      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
    >
      Delete Video
    </button>
  </div>
)}


        {/* Editor Canvas */}
        <div className="p-4 flex-grow overflow-hidden">
          <EditorCanvas selectedClip={selectedClip} textBlocks={textBlocks} shapes={shapes} />
        </div>

        {/* Bottom Control Panel */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          {(activeTab === 'Media' ||
            activeTab === 'Audio' ||
            activeTab === 'Drive') && (
            <UploadPanel onUploadComplete={handleUpload} />
          )}

          {activeTab === 'Text' && (
            <TextTool onAddText={(t) => setTextBlocks((prev) => [...prev, t])} />
          )}

          {activeTab === 'Shapes' && (
            <>
              <button
                onClick={() => setShowShapeModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Choose Shape
              </button>
              {showShapeModal && (
                <ShapeModal
                  onSelect={(shapeType: ShapeType) => {
                    setShapes((prev) => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        type: shapeType,
                        x: 100,
                        y: 100,
                        color: '#00bcd4',
                      },
                    ]);
                    setShowShapeModal(false);
                  }}
                  onClose={() => setShowShapeModal(false)}
                />
              )}
            </>
          )}
        </div>

        {/* Tool Modals */}
        {selectedTool === 'cut' && selectedClip?.type === 'video' && (
          <CutModal
            videoDuration={120} // You can calculate real duration if needed
            onCut={(start, end) => {
              console.log('Cut from', start, 'to', end);
              closeModal();
            }}
            onClose={closeModal}
          />
        )}

        {selectedTool === 'crop' && (
          <CropModal
            onCrop={(region) => {
              console.log('Cropped region:', region);
              closeModal();
            }}
            onClose={closeModal}
          />
        )}

        {selectedTool === 'filter' && (
          <FilterModal
            onApplyFilter={(filterName) => {
              console.log('Applied filter:', filterName);
              closeModal();
            }}
            onClose={closeModal}
          />
        )}

        {selectedTool === 'adjust' && (
  <AdjustModal
    onClose={closeModal}
    onApplyAdjustments={(settings) => {
      console.log('Applied Adjustments:', settings);
      // Apply settings to canvas or state as needed
    }}
  />
)}

{selectedTool === 'audio' && (
  <AudioModal
    onClose={closeModal}
    onAudioSelected={(audioUrl) => {
      console.log('Audio added:', audioUrl);
      // Set audio to canvas or state as needed
    }}
  />
)}


        {selectedTool === 'save' && (
          <SaveModal
            onSave={handleSaveProject}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default CapcutEditorPage;
