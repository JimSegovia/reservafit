const LOG_LEVELS: Record<string, number> = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || 'INFO'] ?? LOG_LEVELS.INFO;

function ts() { return new Date().toISOString(); }

export const logger = {
  debug: (message: string, data?: any) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
      console.log(`[DEBUG] ${ts()} - ${message}`, data || '');
    }
  },
  info: (message: string) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
      console.log(`[INFO] ${ts()} - ${message}`);
    }
  },
  warn: (message: string) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${ts()} - ${message}`);
    }
  },
  error: (message: string, error?: any) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${ts()} - ${message}`);
      if (error) console.error(error);
    }
  },
};
