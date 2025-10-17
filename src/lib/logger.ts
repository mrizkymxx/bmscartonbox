import { config } from './config';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = config.app.env === 'development';

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry;
    
    let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      formattedMessage += ` | Context: ${JSON.stringify(context)}`;
    }
    
    if (error) {
      formattedMessage += ` | Error: ${error.message}`;
      if (this.isDevelopment && error.stack) {
        formattedMessage += `\nStack: ${error.stack}`;
      }
    }
    
    return formattedMessage;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    const formattedMessage = this.formatMessage(entry);

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.debug(formattedMessage);
        }
        break;
    }

    // In production, you might want to send logs to a service
    if (!this.isDevelopment && level === LogLevel.ERROR) {
      // this.sendToLoggingService(entry);
    }
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  // Helper method for database operations
  database(operation: string, collection: string, context?: Record<string, any>): void {
    this.info(`Database ${operation}`, { collection, ...context });
  }

  // Helper method for API operations
  api(method: string, endpoint: string, statusCode?: number, context?: Record<string, any>): void {
    const level = statusCode && statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    this.log(level, `API ${method} ${endpoint}`, { statusCode, ...context });
  }

  // Helper method for user actions
  userAction(action: string, userId?: string, context?: Record<string, any>): void {
    this.info(`User action: ${action}`, { userId, ...context });
  }
}

export const logger = new Logger();
export default logger;