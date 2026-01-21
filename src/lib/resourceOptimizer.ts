/**
 * Resource optimization utilities for improving LCP and CLS
 */

// Resource preloading strategies
export class ResourceOptimizer {
  private static instance: ResourceOptimizer;
  private preloadedResources = new Set<string>();
  private observer?: IntersectionObserver;

  static getInstance(): ResourceOptimizer {
    if (!ResourceOptimizer.instance) {
      ResourceOptimizer.instance = new ResourceOptimizer();
    }
    return ResourceOptimizer.instance;
  }

  // Preload critical resources
  preloadCriticalResources(): void {
    // Preload fonts
    this.preloadFont('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2');
    
    // Preload critical images
    this.preloadImage('/gym.png');
    
    // Preload critical JavaScript modules
    this.preloadModule('/src/main.tsx');
    this.preloadModule('/src/App.tsx');
  }

  // Preload font with proper error handling
  private preloadFont(url: string): void {
    if (this.preloadedResources.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = url;
    
    link.onload = () => {
      this.preloadedResources.add(url);
      console.log(`Font preloaded: ${url}`);
    };
    
    link.onerror = () => {
      console.warn(`Failed to preload font: ${url}`);
    };
    
    document.head.appendChild(link);
  }

  // Preload image with proper error handling
  private preloadImage(url: string): void {
    if (this.preloadedResources.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    
    link.onload = () => {
      this.preloadedResources.add(url);
      console.log(`Image preloaded: ${url}`);
    };
    
    link.onerror = () => {
      console.warn(`Failed to preload image: ${url}`);
    };
    
    document.head.appendChild(link);
  }

  // Preload JavaScript module
  private preloadModule(url: string): void {
    if (this.preloadedResources.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = url;
    
    link.onload = () => {
      this.preloadedResources.add(url);
      console.log(`Module preloaded: ${url}`);
    };
    
    link.onerror = () => {
      console.warn(`Failed to preload module: ${url}`);
    };
    
    document.head.appendChild(link);
  }

  // Lazy load images when they come into viewport
  setupLazyImageLoading(): void {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.observer?.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.01
      });

      // Observe all images with data-src
      document.querySelectorAll('img[data-src]').forEach((img) => {
        this.observer?.observe(img);
      });
    }
  }

  // Load image with proper error handling
  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    if (!src) return;

    img.onload = () => {
      img.classList.add('loaded');
      console.log(`Image loaded: ${src}`);
    };

    img.onerror = () => {
      img.classList.add('error');
      console.warn(`Failed to load image: ${src}`);
    };

    img.src = src;
    img.removeAttribute('data-src');
  }

  // Prefetch resources for next navigation
  prefetchResources(resources: string[]): void {
    resources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      
      // Set low priority for prefetch
      if ('onload' in link) {
        (link as any).onload = () => {
          console.log(`Resource prefetched: ${resource}`);
        };
      }
      
      document.head.appendChild(link);
    });
  }

  // Optimize font loading with font-display: swap
  optimizeFontLoading(): void {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
        src: local('Inter'), url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2') format('woff2');
      }
    `;
    document.head.appendChild(style);
  }

  // Cleanup observers
  cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// CLS prevention utilities
export class CLSPreventer {
  private static instance: CLSPreventer;
  private reservedSpaces = new Map<string, HTMLElement>();

  static getInstance(): CLSPreventer {
    if (!CLSPreventer.instance) {
      CLSPreventer.instance = new CLSPreventer();
    }
    return CLSPreventer.instance;
  }

  // Reserve space for dynamic content
  reserveSpace(id: string, width: number, height: number): HTMLElement {
    const placeholder = document.createElement('div');
    placeholder.id = `placeholder-${id}`;
    placeholder.style.width = `${width}px`;
    placeholder.style.height = `${height}px`;
    placeholder.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
    placeholder.style.borderRadius = '8px';
    placeholder.className = 'cls-placeholder';
    
    this.reservedSpaces.set(id, placeholder);
    return placeholder;
  }

  // Replace placeholder with actual content
  replacePlaceholder(id: string, content: HTMLElement): void {
    const placeholder = this.reservedSpaces.get(id);
    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.replaceChild(content, placeholder);
      this.reservedSpaces.delete(id);
    }
  }

  // Add aspect ratio preservation
  preserveAspectRatio(element: HTMLElement, ratio: number): void {
    element.style.aspectRatio = `${ratio}`;
    element.style.contain = 'layout style';
  }
}

// Initialize optimizations
if (typeof window !== 'undefined') {
  // Initialize resource optimizer
  const resourceOptimizer = ResourceOptimizer.getInstance();
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      resourceOptimizer.preloadCriticalResources();
      resourceOptimizer.optimizeFontLoading();
      resourceOptimizer.setupLazyImageLoading();
    });
  } else {
    resourceOptimizer.preloadCriticalResources();
    resourceOptimizer.optimizeFontLoading();
    resourceOptimizer.setupLazyImageLoading();
  }

  // Initialize CLS preventer
  const clsPreventer = CLSPreventer.getInstance();
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    resourceOptimizer.cleanup();
  });
}

// Export utilities for React components
export const useResourceOptimization = () => {
  const resourceOptimizer = ResourceOptimizer.getInstance();
  const clsPreventer = CLSPreventer.getInstance();
  
  return {
    preloadResource: (url: string, type: 'font' | 'image' | 'module') => {
      switch (type) {
        case 'font':
          (resourceOptimizer as any).preloadFont(url);
          break;
        case 'image':
          (resourceOptimizer as any).preloadImage(url);
          break;
        case 'module':
          (resourceOptimizer as any).preloadModule(url);
          break;
      }
    },
    reserveSpace: clsPreventer.reserveSpace.bind(clsPreventer),
    replacePlaceholder: clsPreventer.replacePlaceholder.bind(clsPreventer),
    preserveAspectRatio: clsPreventer.preserveAspectRatio.bind(clsPreventer),
  };
};
