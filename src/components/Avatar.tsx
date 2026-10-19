import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: AvatarSize;
  className?: string;
  alt?: string;
}

const sizeClasses: Record<AvatarSize, { container: string; icon: number }> = {
  xs: { container: 'w-6 h-6 min-w-6 min-h-6 text-[10px]', icon: 12 },
  sm: { container: 'w-8 h-8 min-w-8 min-h-8 text-xs', icon: 16 },
  md: { container: 'w-10 h-10 min-w-10 min-h-10 text-sm', icon: 20 },
  lg: { container: 'w-14 h-14 min-w-14 min-h-14 text-base', icon: 28 },
  xl: { container: 'w-20 h-20 min-w-20 min-h-20 text-xl', icon: 38 },
  '2xl': { container: 'w-24 h-24 min-w-24 min-h-24 text-2xl', icon: 46 },
};

// Deterministic gentle background palette based on name/string hash
const colorPalette = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-teal-100 text-teal-700 border-teal-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-sky-100 text-sky-700 border-sky-200',
  'bg-slate-100 text-slate-700 border-slate-200',
];

function getColorClass(text?: string): string {
  if (!text) return 'bg-slate-100 text-slate-500 border-slate-200';
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
}

export function Avatar({
  src,
  name,
  size = 'md',
  className = '',
  alt,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const currentSize = sizeClasses[size] || sizeClasses.md;

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const showImage = Boolean(src && !hasError && src.trim() !== '');

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 select-none shadow-2xs ${currentSize.container} ${getColorClass(name)} ${className}`}
      title={name || alt || 'พนักงาน'}
    >
      {showImage ? (
        <img
          src={src!}
          alt={alt || name || 'รูปพนักงาน'}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover rounded-full"
          loading="lazy"
        />
      ) : (
        <span className="flex items-center justify-center font-bold">
          <User size={currentSize.icon} className="opacity-75 stroke-[2]" />
        </span>
      )}
    </div>
  );
}

/**
 * Compresses and resizes an uploaded image file via Canvas to keep base64 compact for localStorage.
 */
export function compressImage(file: File, maxDimension = 256, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('กรุณาเลือกไฟล์รูปภาพเท่านั้น'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์ได้'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('รูปภาพไม่ถูกต้องหรือเสียหาย'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight JPEG data URL
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default Avatar;
