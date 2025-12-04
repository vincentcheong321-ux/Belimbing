
import { SecurityLog } from '../types';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'belimbing_logs_v1';

// --- LocalStorage Helpers (Fallback) ---

const getLogsLocal = (): SecurityLog[] => {
  try {
    const logs = localStorage.getItem(STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (e) {
    console.error("Failed to parse local logs", e);
    return [];
  }
};

const saveLogLocal = (log: SecurityLog): boolean => {
  try {
    const logs = getLogsLocal();
    const newLogs = [log, ...logs];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
    return true;
  } catch (e) {
    console.error("Failed to save log locally", e);
    return false;
  }
};

const clearLogsLocal = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// --- Main Service Methods ---

// Map DB snake_case to TS camelCase
const mapToLog = (row: any): SecurityLog => ({
  id: row.id,
  visitorName: row.visitor_name,
  icNumber: row.ic_number,
  carPlate: row.car_plate,
  destination: row.destination,
  checkInTime: row.check_in_time,
  status: row.status as 'GRANTED' | 'DENIED' | 'EXPIRED',
  aiAnalysis: row.ai_analysis || ''
});

export const getLogs = async (): Promise<SecurityLog[]> => {
  // Fallback if Supabase is not initialized
  if (!supabase) {
    return getLogsLocal();
  }

  try {
    const { data, error } = await supabase
      .from('security_logs')
      .select('*')
      .order('check_in_time', { ascending: false });

    if (error) {
      console.error("Supabase error fetching logs:", error);
      // Optional: Fallback to local if network fails? 
      // For now, let's return local logs if DB fetch fails to ensure UI shows something
      return getLogsLocal(); 
    }

    return data ? data.map(mapToLog) : [];
  } catch (e) {
    console.error("Failed to fetch logs", e);
    return getLogsLocal();
  }
};

export const saveLog = async (log: SecurityLog): Promise<boolean> => {
  // Fallback if Supabase is not initialized
  if (!supabase) {
    return saveLogLocal(log);
  }

  try {
    const { error } = await supabase
      .from('security_logs')
      .insert({
        id: log.id,
        visitor_name: log.visitorName,
        ic_number: log.icNumber,
        car_plate: log.carPlate,
        destination: log.destination,
        check_in_time: log.checkInTime,
        status: log.status,
        ai_analysis: log.aiAnalysis
      });

    if (error) {
      console.error("Supabase error saving log:", error);
      // Attempt local save as backup
      return saveLogLocal(log);
    }
    return true;
  } catch (e) {
    console.error("Failed to save log", e);
    return saveLogLocal(log);
  }
};

export const clearLogs = async (): Promise<void> => {
  if (!supabase) {
    return clearLogsLocal();
  }

  try {
    // Caution: This deletes ALL records that are not the dummy ID (if used for testing)
    const { error } = await supabase.from('security_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
  } catch (e) {
    console.error("Error clearing logs", e);
    clearLogsLocal();
  }
};
