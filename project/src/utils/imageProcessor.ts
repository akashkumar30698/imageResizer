import { ProcessedImage, ResizeSettings, CompressionSettings, EnhanceSettings, ImageDimensions } from '../types/image';

export const getImageDimensions = (file: File): Promise<ImageDimensions> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.src = URL.createObjectURL(file);
  });
};

export const resizeImage = async (file: File, settings: ResizeSettings): Promise<ProcessedImage> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = settings.width;
      canvas.height = settings.height;
      
      ctx.drawImage(img, 0, 0, settings.width, settings.height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({
              blob,
              url: URL.createObjectURL(blob),
              width: settings.width,
              height: settings.height,
              size: blob.size,
              format: 'png'
            });
          }
        },
        'image/png',
        1.0
      );
    };
    img.src = URL.createObjectURL(file);
  });
};

export const compressImage = async (file: File, settings: CompressionSettings): Promise<ProcessedImage> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      const mimeType = `image/${settings.format}`;
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({
              blob,
              url: URL.createObjectURL(blob),
              width: img.width,
              height: img.height,
              size: blob.size,
              format: settings.format,
              quality: settings.quality
            });
          }
        },
        mimeType,
        settings.quality
      );
    };
    img.src = URL.createObjectURL(file);
  });
};

export const enhanceImage = async (file: File, settings: EnhanceSettings): Promise<ProcessedImage> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      // Start with maximum quality
      let quality = 1.0;
      const mimeType = `image/${settings.format}`;
      const targetSizeBytes = settings.targetSize * 1024;
      
      const tryEnhancement = (currentQuality: number) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              if (blob.size >= targetSizeBytes || currentQuality >= 1.0) {
                // If we've reached target size or max quality, add noise if needed
                if (blob.size < targetSizeBytes) {
                  addNoisePadding(canvas, ctx, targetSizeBytes, settings.format, resolve, img);
                } else {
                  resolve({
                    blob,
                    url: URL.createObjectURL(blob),
                    width: img.width,
                    height: img.height,
                    size: blob.size,
                    format: settings.format,
                    quality: currentQuality
                  });
                }
              } else {
                // Try with higher quality
                tryEnhancement(Math.min(currentQuality + 0.1, 1.0));
              }
            }
          },
          mimeType,
          currentQuality
        );
      };
      
      tryEnhancement(quality);
    };
    img.src = URL.createObjectURL(file);
  });
};

const addNoisePadding = (
  canvas: HTMLCanvasElement, 
  ctx: CanvasRenderingContext2D, 
  targetSizeBytes: number, 
  format: string, 
  resolve: (value: ProcessedImage) => void,
  img: HTMLImageElement
) => {
  // Add subtle noise to increase file size
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Add minimal random noise
  for (let i = 0; i < data.length; i += 4) {
    // Add very subtle random variations (1-2 levels max)
    const noise = Math.random() * 2 - 1;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));     // Red
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // Green
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // Blue
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  const mimeType = `image/${format}`;
  canvas.toBlob(
    (blob) => {
      if (blob) {
        resolve({
          blob,
          url: URL.createObjectURL(blob),
          width: img.width,
          height: img.height,
          size: blob.size,
          format: format,
          quality: 1.0
        });
      }
    },
    mimeType,
    1.0
  );
};