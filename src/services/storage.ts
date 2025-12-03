import { SecurityLog } from '../types';

const STORAGE_KEY = 'belimbing_logs_v1';

export const getLogs = (): SecurityLog[] => {
  try {
    const logs = localStorage.getItem(STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (e) {
    console.error("Failed to parse logs", e);
    return [];
  }
};

export const saveLog = (log: SecurityLog): void => {
  try {
    const logs = getLogs();
    // Add new log to the beginning of the array
    const newLogs = [log, ...logs];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
  } catch (e) {
    console.error("Failed to save log", e);
  }
};

export const clearLogs = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
