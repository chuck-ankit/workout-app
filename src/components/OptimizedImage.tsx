import { memo, useState, useRef, useEffect } from 'react';
import { useResourceOptimization } from '../lib/resourceOptimizer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  priority?: boolean;
}

function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes = '100vw',
  priority = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { preserveAspectRatio } = useResourceOptimization();

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (width && height) {
      preserveAspectRatio(img, width / height);
    }

    const handleLoad = () => {
      setIsLoaded(true);
      setIsError(false);
    };

    const handleError = () => {
      setIsError(true);
      setIsLoaded(false);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [width, height, preserveAspectRatio]);

  const generateSrcSet = (baseSrc: string): string => {
    const extensions = ['.png', '.jpg', '.jpeg', '.webp', '.avif'];
    const hasExtension = extensions.some(ext => baseSrc.includes(ext));
    
    if (!hasExtension) return baseSrc;
    
    const baseWithoutExt = baseSrc.replace(/\.[^/.]+$/, '');
    const ext = baseSrc.match(/\.[^/.]+$/)?.[0] || '';
    
    const sizes = [320, 640, 768, 1024, 1280, 1536];
    return sizes
      .map(size => `${baseWithoutExt}_${size}${ext} ${size}w`)
      .join(', ');
  };

  const imgStyle: React.CSSProperties = {
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    ...(width && height ? { aspectRatio: `${width}/${height}` } : {}),
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...(width && height ? { width, height } : {}),
  };

  return (
    <div className={`optimized-image-container ${className}`} style={containerStyle}>
      {!isLoaded && !isError && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      )}
      
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}
      
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        loading={priority ? 'eager' : loading}
        decoding="async"
        style={imgStyle}
        className={`w-full h-full object-cover ${isLoaded ? 'loaded' : ''}`}
        width={width}
        height={height}
      />
    </div>
  );
}

export default memo(OptimizedImage);
