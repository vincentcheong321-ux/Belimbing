
import { SecurityLog } from '../types';
import { supabase } from '../lib/supabase';

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
  try {
    const { data, error } = await supabase
      .from('security_logs')
      .select('*')
      .order('check_in_time', { ascending: false });

    if (error) {
      console.error("Supabase error fetching logs:", error);
      return [];
    }

    return data ? data.map(mapToLog) : [];
  } catch (e) {
    console.error("Failed to fetch logs", e);
    return [];
  }
};

export const saveLog = async (log: SecurityLog): Promise<boolean> => {
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
      return false;
    }
    return true;
  } catch (e) {
    console.error("Failed to save log", e);
    return false;
  }
};

export const clearLogs = async (): Promise<void> => {
  // Caution: This deletes ALL records
  try {
    await supabase.from('security_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  } catch (e) {
    console.error("Error clearing logs", e);
  }
};
