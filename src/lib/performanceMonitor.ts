/**
 * Performance monitoring utilities for the workout app
 */

// Performance metrics interface
interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  memoryUsage?: number;
  bundleSize?: number;
}

// Simple performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure render performance
  measureRender(componentName: string): void {
    const startTime = performance.now();
    
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      this.metrics.push({
        renderTime,
        componentCount: 1,
      });
      
      // Log slow renders
      if (renderTime > 16) { // More than one frame at 60fps
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    });
  }

  // Monitor memory usage (if available)
  getMemoryUsage(): number | null {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return null;
  }

  // Observe long tasks
  observeLongTasks(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    }
  }

  // Get performance report
  getReport(): string {
    const avgRenderTime = this.metrics.reduce((sum, m) => sum + m.renderTime, 0) / this.metrics.length || 0;
    const memoryUsage = this.getMemoryUsage();
    
    return `
Performance Report:
- Average render time: ${avgRenderTime.toFixed(2)}ms
- Memory usage: ${memoryUsage ? `${memoryUsage.toFixed(2)}MB` : 'Not available'}
- Total measurements: ${this.metrics.length}
    `.trim();
  }

  // Cleanup observers
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Performance optimization hooks
export const usePerformanceMonitor = (componentName: string) => {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    measureRender: () => monitor.measureRender(componentName),
    getMemoryUsage: () => monitor.getMemoryUsage(),
  };
};

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  const monitor = PerformanceMonitor.getInstance();
  monitor.observeLongTasks();
  
  // Log performance report every 30 seconds in development
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      console.log(monitor.getReport());
    }, 30000);
  }
}
