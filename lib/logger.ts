/**
 * Logger utility - Only logs in development mode
 * Production logs should go to a proper logging service (Sentry, LogRocket, etc.)
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private log(level: LogLevel, ...args: any[]) {
    if (this.isDevelopment) {
      console[level](...args)
    }
  }

  info(...args: any[]) {
    this.log('info', '[INFO]', ...args)
  }

  warn(...args: any[]) {
    this.log('warn', '[WARN]', ...args)
  }

  error(...args: any[]) {
    // Always log errors, even in production
    console.error('[ERROR]', ...args)
  }

  debug(...args: any[]) {
    this.log('debug', '[DEBUG]', ...args)
  }

  // Specific logger for auth callback with prefix
  auth(...args: any[]) {
    this.log('log', '[Auth Callback]', ...args)
  }

  // Specific logger for API routes
  api(...args: any[]) {
    this.log('log', '[API]', ...args)
  }
}

export const logger = new Logger()
