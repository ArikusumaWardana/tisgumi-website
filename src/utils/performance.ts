export interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private timers: Map<string, number> = new Map();

  startTimer(operation: string): void {
    this.timers.set(operation, performance.now());
  }

  endTimer(operation: string, metadata?: Record<string, any>): number {
    const startTime = this.timers.get(operation);
    if (!startTime) {
      console.warn(`No timer found for operation: ${operation}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(operation);

    const metric: PerformanceMetrics = {
      operation,
      duration,
      timestamp: new Date(),
      ...(metadata && { metadata }),
    };

    this.metrics.push(metric);

    // Log slow operations (> 500ms)
    if (duration > 500) {
      console.warn(
        `Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`,
        metadata
      );
    }

    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    return duration;
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAverageTime(operation: string): number {
    const operationMetrics = this.metrics.filter(
      (m) => m.operation === operation
    );
    if (operationMetrics.length === 0) return 0;

    const total = operationMetrics.reduce((sum, m) => sum + m.duration, 0);
    return total / operationMetrics.length;
  }

  clearMetrics(): void {
    this.metrics = [];
    this.timers.clear();
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor();

// Decorator for async functions
export function measurePerformance(operation: string) {
  return function (
    _target: any,
    _propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      performanceMonitor.startTimer(operation);
      try {
        const result = await method.apply(this, args);
        performanceMonitor.endTimer(operation, { args: args.length });
        return result;
      } catch (error) {
        performanceMonitor.endTimer(operation, {
          error: true,
          args: args.length,
        });
        throw error;
      }
    };

    return descriptor;
  };
}

// Utility function for manual timing
export async function measureAsync<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  performanceMonitor.startTimer(operation);
  try {
    const result = await fn();
    performanceMonitor.endTimer(operation, metadata);
    return result;
  } catch (error) {
    performanceMonitor.endTimer(operation, { ...metadata, error: true });
    throw error;
  }
}

// Client-side performance utilities
export function measureClientPerformance(
  operation: string,
  fn: () => void,
  metadata?: Record<string, any>
): void {
  if (typeof window === "undefined") return;

  const start = performance.now();
  try {
    fn();
    const duration = performance.now() - start;
    console.log(
      `Client operation ${operation}: ${duration.toFixed(2)}ms`,
      metadata
    );
  } catch (error) {
    const duration = performance.now() - start;
    console.error(
      `Client operation ${operation} failed after ${duration.toFixed(2)}ms`,
      error,
      metadata
    );
  }
}
