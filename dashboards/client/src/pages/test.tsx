import { useState } from "react";
import {
  fetchAllInstitutes,
  fetchAllDepartments,
  fetchDepartmentsByInstitute,
  fetchSemesters,
  fetchAcademicCalendarBySemester,
  getSemestersBySemesterYear,
  uploadTimetable,
  getFacultyByShortAndTimetable,
  fetchStudentByDepartment
} from "../api";

export default function FunctionTester() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [inputs, setInputs] = useState({
    instituteId: "",
    academicYearId: "",
    semesterId: "",
    semesterYearId: "",
    timetableId: "",
    short: "",
    parsedData: "[]",
    meta: {
      instituteId: "",
      departmentId: "",
      semesterId: "",
      academicCalendarId: ""
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("meta.")) {
      const key = name.split(".")[1];
      setInputs(prev => ({
        ...prev,
        meta: {
          ...prev.meta,
          [key]: value
        }
      }));
    } else {
      setInputs(prev => ({ ...prev, [name]: value }));
    }
  };

  const testFunction = async (name: string, fn: () => Promise<any>) => {
    try {
      const data = await fn();
      setResults(prev => ({ ...prev, [name]: data }));
    } catch (error: any) {
      setResults(prev => ({ ...prev, [name]: error.message || "Error occurred" }));
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Function Tester</h1>

      {/* fetchAllInstitutes */}
      <button onClick={() => testFunction("fetchAllInstitutes", fetchAllInstitutes)}>
        fetchAllInstitutes
      </button>
      <pre>{JSON.stringify(results.fetchAllInstitutes, null, 2)}</pre>

      {/* fetchAllDepartments */}
      <button onClick={() => testFunction("fetchAllDepartments", fetchAllDepartments)}>
        fetchAllDepartments
      </button>
      <pre>{JSON.stringify(results.fetchAllDepartments, null, 2)}</pre>

      {/* fetchDepartmentsByInstitute */}
      <input
        placeholder="Institute ID"
        name="instituteId"
        value={inputs.instituteId}
        onChange={handleInputChange}
      />
      <button onClick={() => testFunction("fetchDepartmentsByInstitute", () =>
        fetchDepartmentsByInstitute(inputs.instituteId)
      )}>
        fetchDepartmentsByInstitute
      </button>
      <pre>{JSON.stringify(results.fetchDepartmentsByInstitute, null, 2)}</pre>


      {/* fetchSemesters */}
      <input
        placeholder="Academic Year ID (optional)"
        name="academicYearId"
        value={inputs.academicYearId}
        onChange={handleInputChange}
      />
      <button onClick={() => testFunction("fetchSemesters", () =>
        fetchSemesters({
          academicYearId: inputs.academicYearId || undefined,
          instituteId: inputs.instituteId || undefined
        })
      )}>
        fetchSemesters
      </button>
      <pre>{JSON.stringify(results.fetchSemesters, null, 2)}</pre>

      {/* fetchAcademicCalendarBySemester */}
      <input
        placeholder="Semester ID"
        name="semesterId"
        value={inputs.semesterId}
        onChange={handleInputChange}
      />
      <button onClick={() => testFunction("fetchAcademicCalendarBySemester", () =>
        fetchAcademicCalendarBySemester(inputs.semesterId)
      )}>
        fetchAcademicCalendarBySemester
      </button>
      <pre>{JSON.stringify(results.fetchAcademicCalendarBySemester, null, 2)}</pre>

      {/* getSemestersBySemesterYear */}
      <input
        placeholder="Semester Year ID"
        name="semesterYearId"
        value={inputs.semesterYearId}
        onChange={handleInputChange}
      />
      <button onClick={() => testFunction("getSemestersBySemesterYear", () =>
        getSemestersBySemesterYear(inputs.semesterYearId)
      )}>
        getSemestersBySemesterYear
      </button>
      <pre>{JSON.stringify(results.getSemestersBySemesterYear, null, 2)}</pre>

      {/* uploadTimetable */}
      <textarea
        placeholder='Parsed Data (JSON array)'
        name="parsedData"
        value={inputs.parsedData}
        onChange={handleInputChange}
        rows={4}
        cols={50}
      />
      <input name="meta.instituteId" placeholder="Meta Institute ID" value={inputs.meta.instituteId} onChange={handleInputChange} />
      <input name="meta.departmentId" placeholder="Meta Department ID" value={inputs.meta.departmentId} onChange={handleInputChange} />
      <input name="meta.semesterId" placeholder="Meta Semester ID" value={inputs.meta.semesterId} onChange={handleInputChange} />
      <input name="meta.academicCalendarId" placeholder="Meta Academic Calendar ID" value={inputs.meta.academicCalendarId} onChange={handleInputChange} />
      <button onClick={() => testFunction("uploadTimetable", () =>
        uploadTimetable(JSON.parse(inputs.parsedData || "[]"), inputs.meta)
      )}>
        uploadTimetable
      </button>
      <pre>{JSON.stringify(results.uploadTimetable, null, 2)}</pre>

      {/* getFacultyByShortAndTimetable */}
      <input
        placeholder="Faculty Short"
        name="short"
        value={inputs.short}
        onChange={handleInputChange}
      />
      <input
        placeholder="Timetable ID"
        name="timetableId"
        value={inputs.timetableId}
        onChange={handleInputChange}
      />
      <button onClick={() => testFunction("getFacultyByShortAndTimetable", () =>
        getFacultyByShortAndTimetable(inputs.short, inputs.timetableId)
      )}>
        getFacultyByShortAndTimetable
      </button>
      <pre>{JSON.stringify(results.getFacultyByShortAndTimetable, null, 2)}</pre>

      {/* fetchStudentByDepartment */}
      <button onClick={() => testFunction("fetchStudentByDepartment", () =>
        fetchStudentByDepartment(inputs.short, inputs.timetableId)
      )}>
        fetchStudentByDepartment
      </button>
      <pre>{JSON.stringify(results.fetchStudentByDepartment, null, 2)}</pre>
    </div>
  );
}
