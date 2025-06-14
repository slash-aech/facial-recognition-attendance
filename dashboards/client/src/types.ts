export interface Classroom {
  id: number;
  is_active: boolean;
  latitude: number;
  longitude: number;
  name: string;
  radius: number; // in meters
}

export interface AttendanceRecord {
  id: number;
  email: string;
  timestamp: string;
  latitude: number;
  longitude: number;
}
