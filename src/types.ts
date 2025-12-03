export interface VisitorData {
  fullName: string;
  phoneNumber: string;
  icNumber: string;
  carPlate?: string;
  blockNumber: string;
  lotNumber: string;
  unitNumber: string;
  timestamp: number; // Unix timestamp for creation
}

export interface SecurityLog {
  id: string;
  visitorName: string;
  icNumber: string;
  carPlate?: string;
  destination: string;
  checkInTime: string;
  status: 'GRANTED' | 'DENIED' | 'EXPIRED';
  aiAnalysis: string;
}

export enum AppMode {
  HOME = 'HOME',
  VISITOR = 'VISITOR',
  GUARD = 'GUARD',
  PRESENTATION = 'PRESENTATION'
}
