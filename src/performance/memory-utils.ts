/**
 * Memory measurement utilities for performance testing
 */

export class MemoryUtils {
  private gcDetectionThreshold = 10 * 1024 * 1024 // 10MB threshold for GC detection

  /**
   * Force garbage collection if available
   */
  forceGarbageCollection(): void {
    if (global.gc) {
      try {
        global.gc()
        // Wait for GC to complete
        this.waitForMemoryStabilization()
      } catch (error) {
        // GC might not be available or might fail, log and continue
        const errorMessage = error instanceof Error
          ? error.message
          : String(error)

        console.warn('Warning: Could not force garbage collection:', errorMessage)
      }
    }
  }

  /**
   * Establish memory baseline by taking multiple readings
   */
  establishMemoryBaseline(): number {
    // Force GC if available to establish a clean baseline
    this.forceGarbageCollection()

    // Take multiple readings to establish stable baseline
    const readings: number[] = []

    for (let i = 0; i < 3; i++) {
      readings.push(process.memoryUsage().heapUsed)
      // Small delay between readings
      const start = Date.now()

      while (Date.now() - start < 10) {
        // Busy wait for 10ms
      }
    }

    return Math.min(...readings)
  }

  /**
   * Get stabilized memory reading with GC interference detection
   */
  getStabilizedMemoryReading(): number {
    const readings: number[] = []

    // Take multiple memory readings to detect GC interference
    for (let i = 0; i < 5; i++) {
      readings.push(process.memoryUsage().heapUsed)

      // Small delay between readings
      const start = Date.now()

      while (Date.now() - start < 5) {
        // Busy wait for 5ms
      }
    }

    // Check for GC interference (large drops in memory)
    const hasGcInterference = this.detectGarbageCollection(readings)

    if (hasGcInterference) {
      // If GC occurred, wait a bit and take fresh readings
      this.waitForMemoryStabilization()
      return this.getCleanMemoryReading()
    }

    // Return the median reading to avoid outliers
    return this.getMedianValue(readings)
  }

  /**
   * Detect if garbage collection occurred during readings
   */
  private detectGarbageCollection(readings: number[]): boolean {
    for (let i = 1; i < readings.length; i++) {
      const memoryDrop = readings[i - 1] - readings[i]

      // If memory dropped significantly, likely GC occurred
      if (memoryDrop > this.gcDetectionThreshold) {
        return true
      }
    }

    return false
  }

  /**
   * Wait for memory to stabilize after GC
   */
  private waitForMemoryStabilization(): void {
    const stabilizationTime = 50 // 50ms
    const start = Date.now()

    while (Date.now() - start < stabilizationTime) {
      // Busy wait
    }
  }

  /**
   * Get a single clean memory reading after stabilization
   */
  private getCleanMemoryReading(): number {
    return process.memoryUsage().heapUsed
  }

  /**
   * Calculate median value from array of numbers
   */
  private getMedianValue(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)

    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2
    }

    return sorted[mid]
  }
}
