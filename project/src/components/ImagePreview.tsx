import React from 'react';
import { Download, Info } from 'lucide-react';
import { ProcessedImage } from '../types/image';
import { formatFileSize } from '../utils/helpers';

interface ImagePreviewProps {
  originalImage: File;
  processedImage: ProcessedImage | null;
  isProcessing: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  originalImage, 
  processedImage, 
  isProcessing 
}) => {
  const originalUrl = React.useMemo(() => 
    URL.createObjectURL(originalImage), [originalImage]
  );

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage.url;
    link.download = `processed_${originalImage.name.split('.')[0]}.${processedImage.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Original Image */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Original</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Info className="w-4 h-4" />
            <span>{formatFileSize(originalImage.size)}</span>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-xl bg-gray-100">
          <img
            src={originalUrl}
            alt="Original"
            className="w-full h-auto max-h-96 object-contain"
          />
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-gray-500">Format</span>
            <p className="font-medium">{originalImage.type.split('/')[1].toUpperCase()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-gray-500">Size</span>
            <p className="font-medium">{formatFileSize(originalImage.size)}</p>
          </div>
        </div>
      </div>

      {/* Processed Image */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Processed</h3>
          {processedImage && (
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          )}
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gray-100 min-h-[200px] flex items-center justify-center">
          {isProcessing ? (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Processing image...</p>
            </div>
          ) : processedImage ? (
            <img
              src={processedImage.url}
              alt="Processed"
              className="w-full h-auto max-h-96 object-contain"
            />
          ) : (
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8" />
              </div>
              <p>Process your image to see the result</p>
            </div>
          )}
        </div>

        {processedImage && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-500">Format</span>
                <p className="font-medium">{processedImage.format.toUpperCase()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-500">Size</span>
                <p className="font-medium">{formatFileSize(processedImage.size)}</p>
              </div>
            </div>
            
            {/* Size Comparison */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Size Change</span>
                <span className={`font-semibold ${
                  processedImage.size < originalImage.size 
                    ? 'text-green-600' 
                    : processedImage.size > originalImage.size 
                      ? 'text-blue-600' 
                      : 'text-gray-600'
                }`}>
                  {processedImage.size < originalImage.size && '-'}
                  {processedImage.size > originalImage.size && '+'}
                  {Math.abs(((processedImage.size - originalImage.size) / originalImage.size) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;