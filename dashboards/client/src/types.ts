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

export interface Institute {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface Department {
  id: string;
  name: string;
  institute_id: string;
}

export interface AcademicYear {
  id: string;
  start_year: number;
  end_year: number;
}

export interface Semester {
  id: string;
  semester_type: string;
  academic_year_id: string;
  institute_id: string;
}

export interface RegisterFacePayload {
  subject: string;
  base64Image: string;
  email: string;
  password: string;
  user_role: string;
}
export interface Meta {
  instituteId: string;
  departmentId: string;
  semesterId: string;
  academicCalendarId: string;
}