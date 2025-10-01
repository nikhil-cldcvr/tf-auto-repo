/**
 * Logging Utility
 * 
 * This module provides a standardized logging interface for the application.
 * It wraps a logging library and provides consistent formatting and log levels.
 */

// In a real implementation, this would likely use a proper logging library
// like winston, bunyan, or pino
export const logging = {
  /**
   * Create a child logger with additional context
   * 
   * @param context - Additional context to include in logs
   * @returns Logger instance with the provided context
   */
  child: (context: Record<string, unknown>) => {
    return {
      /**
       * Log an informational message
       * 
       * @param message - The message to log
       * @param additionalContext - Additional context to include
       */
      info: (message: string, additionalContext?: Record<string, unknown>) => {
        console.log(JSON.stringify({
          level: 'INFO',
          message,
          timestamp: new Date().toISOString(),
          ...context,
          ...additionalContext
        }));
      },

      /**
       * Log an error message
       * 
       * @param message - The error message
       * @param additionalContext - Additional context to include
       */
      error: (message: string, additionalContext?: Record<string, unknown>) => {
        console.error(JSON.stringify({
          level: 'ERROR',
          message,
          timestamp: new Date().toISOString(),
          ...context,
          ...additionalContext
        }));
      },

      /**
       * Log a warning message
       * 
       * @param message - The warning message
       * @param additionalContext - Additional context to include
       */
      warn: (message: string, additionalContext?: Record<string, unknown>) => {
        console.warn(JSON.stringify({
          level: 'WARN',
          message,
          timestamp: new Date().toISOString(),
          ...context,
          ...additionalContext
        }));
      },

      /**
       * Log a debug message
       * 
       * @param message - The debug message
       * @param additionalContext - Additional context to include
       */
      debug: (message: string, additionalContext?: Record<string, unknown>) => {
        console.debug(JSON.stringify({
          level: 'DEBUG',
          message,
          timestamp: new Date().toISOString(),
          ...context,
          ...additionalContext
        }));
      }
    };
  }
};