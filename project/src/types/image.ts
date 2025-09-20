export interface ProcessedImage {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
  quality?: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface CompressionSettings {
  quality: number;
  format: string;
}

export interface ResizeSettings {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
}

export interface EnhanceSettings {
  targetSize: number; // in KB
  format: string;
}