export interface Classroom {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
}

export interface AttendanceRecord {
  id: number;
  email: string;
  timestamp: string;
  latitude: number;
  longitude: number;
}
