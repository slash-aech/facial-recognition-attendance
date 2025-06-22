import axios from "axios";

// const BASE_URL = "https://facial-recognition-attendance-backend.onrender.com/api";
const BASE_URL = "http://localhost:10000/api"
// Define types
interface RegisterFacePayload {
  subject: string;
  base64Image: string;
  email: string;
  password: string;
  user_role: string;
}

export async function fetchUserById(uniqueId: string) {
  if (!uniqueId) throw new Error("Unique ID required");
  const response = await axios.get(`${BASE_URL}/user/${uniqueId}`);
  return response.data;
}

export async function changePassword(user_info_id: string, newPassword: string) {
  if (!user_info_id || !newPassword) {
    throw new Error("user_info_id and newPassword are required");
  }

  const response = await axios.post(`${BASE_URL}/user/changePassword`, {
    user_info_id,
    newPassword,
  });

  return response.data;
}

export async function checkFaceRegistered(base64Image: string) {
  if (!base64Image) throw new Error("Base64 image required");

  const response = await axios.post(`${BASE_URL}/face/check`, {
    base64Image,
  });

  return response.data;
}

export async function registerFace({ subject, base64Image, email, password }: RegisterFacePayload) {
  if (!subject || !base64Image || !email || !password) {
    throw new Error("subject, base64Image, email and password are required");
  }

  const response = await axios.post(`${BASE_URL}/face/register`, {
    subject,
    base64Image,
    email,
    password,
  });

  return response.data;
}

export async function faceLogin(base64Image: string) {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/face-login`,
      { image: base64Image },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("Login success:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    return error;
  }
}

const api = axios.create({
  baseURL: BASE_URL, // your backend URL
  withCredentials: true,  // important to send cookies
});

// Fetch all institutes
export async function fetchAllInstitutes() {
  const response = await api.get(`${BASE_URL}/superAdmin/institutes`);
  return response.data;
}

// Fetch all departments
export async function fetchAllDepartments() {
  const response = await api.get(`${BASE_URL}/superAdmin/departments`);
  return response.data;
}

// Fetch departments by institute ID
export async function fetchDepartmentsByInstitute(instituteId: string) {
  if (!instituteId) throw new Error("Institute ID required");
  const response = await api.get(`${BASE_URL}/superAdmin/${instituteId}/departments`);
  return response.data;
}

// Fetch all academic years
export async function fetchAcademicYears() {
  const response = await api.get(`${BASE_URL}/superAdmin/academic-years`);
  return response.data;
}

// Fetch all semesters, optionally filtered
export async function fetchSemesters(filters?: { academicYearId?: string; instituteId?: string }) {
  const params = new URLSearchParams();
  if (filters?.academicYearId) params.append("academicYearId", filters.academicYearId);
  if (filters?.instituteId) params.append("instituteId", filters.instituteId);

  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await api.get(`${BASE_URL}/superAdmin/semesters${query}`);
  return response.data;
}

export const fetchAcademicCalendarBySemester = async (semesterId?:string) => {
  const res = await axios.get(`${BASE_URL}/superAdmin/${semesterId}`);
  console.log(res.data);
  return res.data;
};


interface Meta {
  instituteId: string;
  departmentId: string;
  semesterId: string;
  academicCalendarId: string;
}

export const uploadTimetable = async (parsedData: any[], meta: Meta) => {
  try {
    const res = await axios.post(`${BASE_URL}/timetable/upload-timetable`, {
      parsedData,
      meta
    });
    return res.data;
  } catch (error: any) {
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

interface UploadFacultyDataParams {
  spreadsheet_id: string;
  sheet_name: string;
  institute_id: string;
  dept_id: string;
  academic_calendar_id: string;
}

export const uploadFacultyData = async (data: UploadFacultyDataParams): Promise<string> => {
  try {
    const response = await axios.post<{ message: string }>('/api/upload/faculties', data);
    return response.data.message;
  } catch (error: any) {
    throw error.response?.data?.message || 'Upload failed';
  }
};

export default api;