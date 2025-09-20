import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import ImagePreview from './components/ImagePreview';
import ProcessingControls from './components/ProcessingControls';
import { ProcessedImage } from './types/image';

function App() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setProcessedImage(null);
  };

  const handleImageProcessed = (processed: ProcessedImage) => {
    setProcessedImage(processed);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ImagePro Studio
                </h1>
                <p className="text-sm text-gray-600">Resize • Compress • Enhance</p>
              </div>
            </div>
            {originalImage && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white/60 hover:bg-white/80 rounded-lg border border-white/30 transition-all duration-200"
              >
                New Image
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!originalImage ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Professional Image Processing
              </h2>
              <p className="text-lg text-gray-600">
                Upload your image to start resizing, compressing, or enhancing with advanced controls
              </p>
            </div>
            <ImageUpload onImageUpload={handleImageUpload} />
          </div>
        ) : (
          <div className="space-y-8">
            <ImagePreview 
              originalImage={originalImage} 
              processedImage={processedImage}
              isProcessing={isProcessing}
            />
            <ProcessingControls
              originalImage={originalImage}
              onImageProcessed={handleImageProcessed}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;