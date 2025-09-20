import React, { useState } from 'react';
import { Maximize2, Minimize2, Zap, Download } from 'lucide-react';
import { ProcessedImage, ResizeSettings, CompressionSettings, EnhanceSettings } from '../types/image';
import { resizeImage, compressImage, enhanceImage, getImageDimensions } from '../utils/imageProcessor';

interface ProcessingControlsProps {
  originalImage: File;
  onImageProcessed: (processed: ProcessedImage) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const ProcessingControls: React.FC<ProcessingControlsProps> = ({
  originalImage,
  onImageProcessed,
  isProcessing,
  setIsProcessing
}) => {
  const [activeTab, setActiveTab] = useState<'resize' | 'compress' | 'enhance'>('resize');
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  
  // Resize settings
  const [resizeSettings, setResizeSettings] = useState<ResizeSettings>({
    width: 0,
    height: 0,
    maintainAspectRatio: true
  });
  
  // Compression settings
  const [compressionSettings, setCompressionSettings] = useState<CompressionSettings>({
    quality: 0.8,
    format: 'jpeg'
  });
  
  // Enhancement settings
  const [enhanceSettings, setEnhanceSettings] = useState<EnhanceSettings>({
    targetSize: 100,
    format: 'jpeg'
  });

  React.useEffect(() => {
    const loadImageDimensions = async () => {
      const dimensions = await getImageDimensions(originalImage);
      setOriginalDimensions(dimensions);
      setResizeSettings(prev => ({
        ...prev,
        width: dimensions.width,
        height: dimensions.height
      }));
    };
    
    loadImageDimensions();
  }, [originalImage]);

  const handleResize = async () => {
    setIsProcessing(true);
    try {
      const processed = await resizeImage(originalImage, resizeSettings);
      onImageProcessed(processed);
    } catch (error) {
      console.error('Resize error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompress = async () => {
    setIsProcessing(true);
    try {
      const processed = await compressImage(originalImage, compressionSettings);
      onImageProcessed(processed);
    } catch (error) {
      console.error('Compression error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnhance = async () => {
    setIsProcessing(true);
    try {
      const processed = await enhanceImage(originalImage, enhanceSettings);
      onImageProcessed(processed);
    } catch (error) {
      console.error('Enhancement error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    if (resizeSettings.maintainAspectRatio) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      if (dimension === 'width') {
        setResizeSettings(prev => ({
          ...prev,
          width: value,
          height: Math.round(value / aspectRatio)
        }));
      } else {
        setResizeSettings(prev => ({
          ...prev,
          height: value,
          width: Math.round(value * aspectRatio)
        }));
      }
    } else {
      setResizeSettings(prev => ({
        ...prev,
        [dimension]: value
      }));
    }
  };

  const tabs = [
    { id: 'resize', label: 'Resize', icon: Maximize2 },
    { id: 'compress', label: 'Compress', icon: Minimize2 },
    { id: 'enhance', label: 'Enhance', icon: Zap }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Resize Tab */}
      {activeTab === 'resize' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Resize Image</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width (px)</label>
                <input
                  type="number"
                  value={resizeSettings.width}
                  onChange={(e) => handleDimensionChange('width', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (px)</label>
                <input
                  type="number"
                  value={resizeSettings.height}
                  onChange={(e) => handleDimensionChange('height', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="aspectRatio"
              checked={resizeSettings.maintainAspectRatio}
              onChange={(e) => setResizeSettings(prev => ({ ...prev, maintainAspectRatio: e.target.checked }))}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="aspectRatio" className="text-sm text-gray-700">
              Maintain aspect ratio
            </label>
          </div>

          <button
            onClick={handleResize}
            disabled={isProcessing}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isProcessing ? 'Resizing...' : 'Resize Image'}
          </button>
        </div>
      )}

      {/* Compress Tab */}
      {activeTab === 'compress' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Compress Image</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality: {Math.round(compressionSettings.quality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={compressionSettings.quality}
                  onChange={(e) => setCompressionSettings(prev => ({ ...prev, quality: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low Quality</span>
                  <span>High Quality</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
                <select
                  value={compressionSettings.format}
                  onChange={(e) => setCompressionSettings(prev => ({ ...prev, format: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleCompress}
            disabled={isProcessing}
            className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isProcessing ? 'Compressing...' : 'Compress Image'}
          </button>
        </div>
      )}

      {/* Enhance Tab */}
      {activeTab === 'enhance' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Enhance File Size</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Size (KB)</label>
                <input
                  type="number"
                  value={enhanceSettings.targetSize}
                  onChange={(e) => setEnhanceSettings(prev => ({ ...prev, targetSize: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
                <select
                  value={enhanceSettings.format}
                  onChange={(e) => setEnhanceSettings(prev => ({ ...prev, format: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleEnhance}
            disabled={isProcessing}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isProcessing ? 'Enhancing...' : 'Enhance Image'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProcessingControls;