import axios from "axios";
import type { RegisterFacePayload } from './types';

// Base API URL - change to production or development as needed
const BASE_URL = "https://facial-recognition-attendance-backend.onrender.com"; // Localhost (you can switch to production if needed)

// Create Axios instance with credentials
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/**
 * Fetches user data by their unique user_info ID.
 * @param uniqueId - The unique ID of the user
 * @returns User data object
 */
export async function fetchUserById(uniqueId: string) {
  if (!uniqueId) throw new Error("Unique ID required");
  const response = await api.get(`${BASE_URL}/user/${uniqueId}`);
  return response.data; // Returns user data (structure depends on backend response)
}

/**
 * Changes the password of a user.
 * @param user_info_id - User's ID
 * @param newPassword - New password string
 * @returns Confirmation message or status
 */
export async function changePassword(user_info_id: string, newPassword: string) {
  if (!user_info_id || !newPassword) throw new Error("user_info_id and newPassword are required");
  const response = await api.post(`${BASE_URL}/user/changePassword`, {
    user_info_id,
    newPassword,
  });
  return response.data; // Returns status or success message
}

/**
 * Checks if a face image is already registered.
 * @param base64Image - Base64 encoded string of face image
 * @returns Result indicating whether face is registered or not
 */
export async function checkFaceRegistered(base64Image: string) {
  if (!base64Image) throw new Error("Base64 image required");
  const response = await api.post(`${BASE_URL}/face/check`, { base64Image });
  return response.data; // Returns result (boolean or message depending on backend)
}

/**
 * Registers a user's face image to the system.
 * @param payload - Includes subject, base64Image, email, password
 * @returns Status or success confirmation
 */
export async function registerFace({ subject, base64Image, email, password }: RegisterFacePayload) {
  if (!subject || !base64Image || !email || !password) throw new Error("subject, base64Image, email and password are required");
  const response = await api.post(`${BASE_URL}/face/register`, { subject, base64Image, email, password });
  return response.data; // Returns registration status or confirmation
}

/**
 * Logs in a user via facial recognition (base64 image input).
 * @param base64Image - Image used for login
 * @returns Login result including user info and token or error
 */
export async function faceLogin(base64Image: string) {
  try {
    const response = await api.post(`${BASE_URL}/user/face-login`, { image: base64Image }, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data; // Returns token, user info, or similar
  } catch (error: any) {
    return error; // Returns error object
  }
}

/**
 * Fetches all institutes in the system.
 * @returns Array of institute objects
 */
export async function fetchAllInstitutes() {
  const response = await api.get(`${BASE_URL}/superAdmin/institutes`);
  return response.data; // Returns [{ id, name, ... }, ...]
}

/**
 * Fetches all departments.
 * @returns Array of department objects
 */
export async function fetchAllDepartments() {
  const response = await api.get(`${BASE_URL}/superAdmin/departments`);
  return response.data; // Returns [{ id, name, ... }, ...]
}

/**
 * Fetch departments by institute ID.
 * @param instituteId - Institute identifier
 * @returns Array of departments under specified institute
 */
export async function fetchDepartmentsByInstitute(instituteId: string) {
  if (!instituteId) throw new Error("Institute ID required");
  const response = await api.get(`${BASE_URL}/superAdmin/${instituteId}/departments`);
  return response.data; // Returns [{ id, name, ... }, ...]
}

/**
 * Fetch list of academic years.
 * @returns Array of academic year entries
 */

/**
 * Fetch semesters, filtered by academic year or institute.
 * @param filters - Optional filter by academicYearId and/or instituteId
 * @returns Array of semester entries
 */
export async function fetchSemesters(filters?: { academicYearId?: string; instituteId?: string }) {
  const params = new URLSearchParams();
  if (filters?.academicYearId) params.append("academicYearId", filters.academicYearId);
  if (filters?.instituteId) params.append("instituteId", filters.instituteId);
  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await api.get(`${BASE_URL}/superAdmin/semesters${query}`);
  return response.data; // Returns [{ id, name, ... }, ...]
}

/**
 * Fetch academic calendar associated with a semester.
 * @param semesterId - Semester ID
 * @returns Academic calendar object
 */
export const fetchAcademicCalendarBySemester = async (semesterId?: string) => {
  const res = await api.get(`${BASE_URL}/superAdmin/${semesterId}`);
  return res.data; // Returns academic calendar data
};

// Types for semester structure
export interface Semester {
  id: string;
  semester_id: string;
  semester_number: number;
}

/**
 * Get all semesters that belong to a semester year.
 * @param semesterYearId - The semester year ID
 * @returns Array of Semester objects
 */
export const getSemestersBySemesterYear = async (semesterYearId: string): Promise<Semester[]> => {
  const response = await axios.get(`${BASE_URL}/superAdmin/${semesterYearId}`);
  return response.data; // Returns [{ id, semester_id, semester_number }, ...]
};

// Metadata for timetable upload
interface Meta {
  instituteId: string;
  departmentId: string;
  semesterId: string;
  academicCalendarId: string;
}

/**
 * Uploads a timetable to the backend.
 * @param parsedData - Timetable data (usually parsed from Excel)
 * @param meta - Metadata like academicCalendarId, deptId, etc.
 * @returns Status of upload operation
 */
export const uploadTimetable = async (parsedData: any[], meta: Meta) => {
  try {
    const res = await api.post(`${BASE_URL}/timetable/upload-timetable`, { parsedData, meta });
    return res.data; // Returns { success: true/false, ... }
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

// Params to upload faculty data using spreadsheet
interface UploadFacultyDataParams {
  spreadsheet_id: string;
  sheet_name: string;
  institute_id: string;
  dept_id: string;
  academic_calendar_id: string;
}

/**
 * Uploads faculty data via spreadsheet.
 * @returns Success message
 */
export const uploadFacultyData = async (data: UploadFacultyDataParams): Promise<string> => {
  try {
    const response = await axios.post<{ message: string }>(`${BASE_URL}/upload/faculties`, data);
    return response.data.message; // Returns "Upload successful" or similar message
  } catch (error: any) {
    throw error.response?.data?.message || 'Upload failed';
  }
};

// Payload to upload student data
interface UploadStudentDataPayload {
  rows: string[][];
  institute_id: string;
  dept_id: string;
  semester_year_id: string;
  academic_calendar_id: string;
}

/**
 * Uploads student data (usually from Excel rows).
 * @returns Plain backend response
 */
export const uploadStudentData = async (payload: UploadStudentDataPayload): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}/upload/upload-students`, payload);
    return response.data; // Returns plain backend response (structure not specified)
  } catch (error: any) {
    throw error;
  }
};

// Timetable payload for teachers
export interface TeacherTimetablePayload {
  spreadsheet_id: string;
  sheet_name: string;
  academic_calendar_id: string;
  teacher_enrollment_info_id: string;
  dept_id: string;
  institute_id: string;
}

/**
 * Uploads timetable for a specific teacher.
 * @returns Upload result or error
 */
export async function uploadTeacherTimetable(payload: TeacherTimetablePayload) {
  try {
    const response = await axios.post(`${BASE_URL}/api/timetable/upload-teacher-timetable`, payload);
    return response.data; // Returns { success: true, ... }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to upload timetable');
  }
}



// Params to upload class timetable
interface UploadClassTimetableParams {
  spreadsheetId: string;
  sheetName: string;
  academicYearId: string;
  semesterYearId: string;
  academicCalendarId: string;
  classShort: string;
  departmentId: string;
  instituteId: string;
}

/**
 * Uploads a class timetable with metadata.
 * @returns Upload confirmation or error
 */
export const uploadClassTimetable = async (params: UploadClassTimetableParams) => {
  try {
    const response = await axios.post(`${BASE_URL}/upload/upload-class-timetable`, {
      spreadsheet_id: params.spreadsheetId,
      sheet_name: params.sheetName,
      academic_year_id: params.academicYearId,
      semester_year_id: params.semesterYearId,
      academic_calendar_id: params.academicCalendarId,
      class_short: params.classShort,
      dept_id: params.departmentId,
      institute_id: params.instituteId,
    });
    return response.data; // Plain backend response (success or failure info)
  } catch (error: any) {
    throw error;
  }
};

// Faculty structure type
export interface Faculty {
  id: string;
  user_id: string;
  tt_display_full_name: string;
  short: string;
  color: string;
  timetable_id: string;
}

/**
 * Fetches faculty information by short code and timetable ID.
 * @returns Faculty object
 */
export const getFacultyByShortAndTimetable = async (
  short: string,
  timetable_id: string
): Promise<Faculty> => {
  try {
    const response = await axios.get<Faculty>(`${BASE_URL}/faculty/facultyDataByTimetableId`, {
      params: { short, timetable_id },
    });
    return response.data; // Returns faculty object with display name, timetable ID, etc.
  } catch (error: any) {
    throw error;
  }
};
export const fetchStudentByDepartment = async (
  short: string,
  timetable_id: string
): Promise<Faculty> => {
  try {
    const response = await axios.get<Faculty>(`${BASE_URL}/faculty/facultyDataByTimetableId`, {
      params: { short, timetable_id },
    });
    return response.data; // Returns faculty object with display name, timetable ID, etc.
  } catch (error: any) {
    throw error;
  }
};

export default api;