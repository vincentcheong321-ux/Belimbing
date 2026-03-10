
export interface VisitorData {
  fullName: string;
  phoneNumber: string;
  icNumber: string;
  carPlate?: string;
  blockNumber: string;
  lotNumber: string;
  unitNumber: string;
  purpose: string;
  timestamp: number; // Unix timestamp for creation
}

export interface SecurityLog {
  id: string;
  visitorName: string;
  icNumber: string;
  carPlate?: string;
  destination: string;
  purpose: string;
  checkInTime: string;
  status: 'GRANTED' | 'DENIED' | 'EXPIRED' | 'BLACKLISTED';
  aiAnalysis: string;
}

export enum AppMode {
  HOME = 'HOME',
  VISITOR = 'VISITOR',
  GUARD = 'GUARD',
  PRESENTATION = 'PRESENTATION',
  KTV_DOWNLOAD = 'KTV_DOWNLOAD',
  ADMIN = 'ADMIN'
}
