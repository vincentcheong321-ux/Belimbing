
import { SecurityLog } from '../types';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'belimbing_logs_v1';
const BLACKLIST_KEY = 'belimbing_blacklist_v1';

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

// --- Blacklist Management ---

export const getBlacklist = (): string[] => {
  try {
    const list = localStorage.getItem(BLACKLIST_KEY);
    return list ? JSON.parse(list) : [];
  } catch {
    return [];
  }
};

export const addToBlacklist = (icNumber: string): void => {
  const list = getBlacklist();
  if (!list.includes(icNumber)) {
    localStorage.setItem(BLACKLIST_KEY, JSON.stringify([...list, icNumber]));
  }
};

export const removeFromBlacklist = (icNumber: string): void => {
  const list = getBlacklist();
  localStorage.setItem(BLACKLIST_KEY, JSON.stringify(list.filter(ic => ic !== icNumber)));
};

// --- Main Service Methods ---

const mapToLog = (row: any): SecurityLog => ({
  id: row.id,
  visitorName: row.visitor_name,
  icNumber: row.ic_number,
  carPlate: row.car_plate,
  destination: row.destination,
  purpose: row.purpose || 'General Visit',
  checkInTime: row.check_in_time,
  status: row.status as any,
  aiAnalysis: row.ai_analysis || ''
});

export const getLogs = async (): Promise<SecurityLog[]> => {
  if (!supabase) return getLogsLocal();

  try {
    const { data, error } = await supabase
      .from('security_logs')
      .select('*')
      .order('check_in_time', { ascending: false });

    if (error) return getLogsLocal(); 
    return data ? data.map(mapToLog) : [];
  } catch (e) {
    return getLogsLocal();
  }
};

export const saveLog = async (log: SecurityLog): Promise<boolean> => {
  if (!supabase) return saveLogLocal(log);

  try {
    const { error } = await supabase
      .from('security_logs')
      .insert({
        id: log.id,
        visitor_name: log.visitorName,
        ic_number: log.icNumber,
        car_plate: log.carPlate,
        destination: log.destination,
        purpose: log.purpose,
        check_in_time: log.checkInTime,
        status: log.status,
        ai_analysis: log.aiAnalysis
      });

    if (error) return saveLogLocal(log);
    return true;
  } catch (e) {
    return saveLogLocal(log);
  }
};

export const clearLogs = async (): Promise<void> => {
  if (!supabase) return clearLogsLocal();
  try {
    await supabase.from('security_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  } catch (e) {
    clearLogsLocal();
  }
};
