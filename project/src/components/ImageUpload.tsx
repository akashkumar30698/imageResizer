import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setIsUploading(true);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      setTimeout(() => {
        onImageUpload(imageFile);
        setIsUploading(false);
      }, 800);
    } else {
      setIsUploading(false);
    }
  }, [onImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      setTimeout(() => {
        onImageUpload(file);
        setIsUploading(false);
      }, 800);
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-400 bg-blue-50 scale-105 shadow-lg'
            : 'border-gray-300 bg-white/60 hover:bg-white/80 hover:border-gray-400'
        } ${isUploading ? 'border-green-400 bg-green-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="space-y-6">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            isUploading 
              ? 'bg-green-100 animate-pulse' 
              : isDragging 
                ? 'bg-blue-100' 
                : 'bg-gray-100'
          }`}>
            {isUploading ? (
              <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Upload className={`w-8 h-8 transition-colors duration-300 ${
                isDragging ? 'text-blue-600' : 'text-gray-500'
              }`} />
            )}
          </div>

          <div>
            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
              isUploading 
                ? 'text-green-800' 
                : isDragging 
                  ? 'text-blue-800' 
                  : 'text-gray-800'
            }`}>
              {isUploading 
                ? 'Processing your image...' 
                : isDragging 
                  ? 'Drop your image here' 
                  : 'Upload your image'
              }
            </h3>
            
            {!isUploading && (
              <p className="text-gray-600 mb-6">
                Drag and drop your image here, or click to browse
              </p>
            )}
          </div>

          {!isUploading && (
            <>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <ImageIcon className="w-4 h-4" />
                  <span>JPG, PNG, WebP</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Max 50MB</span>
              </div>

              <button
                type="button"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                <Upload className="w-5 h-5 mr-2" />
                Choose Image
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;