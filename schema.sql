--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: attendance_status_enum; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.attendance_status_enum AS ENUM (
    'present',
    'absent',
    'late',
    'excused'
);


ALTER TYPE public.attendance_status_enum OWNER TO neondb_owner;

--
-- Name: lesson_type_enum; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.lesson_type_enum AS ENUM (
    'Lecture',
    'Lab'
);


ALTER TYPE public.lesson_type_enum OWNER TO neondb_owner;

--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.user_role_enum AS ENUM (
    'admin',
    'hod',
    'teacher',
    'student',
    'superadmin'
);


ALTER TYPE public.user_role_enum OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academic_calendar; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.academic_calendar (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    semester_id uuid NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL
);


ALTER TABLE public.academic_calendar OWNER TO neondb_owner;

--
-- Name: academic_year; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.academic_year (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    start_year integer NOT NULL,
    end_year integer NOT NULL
);


ALTER TABLE public.academic_year OWNER TO neondb_owner;

--
-- Name: attendance_log; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
)
PARTITION BY RANGE (academic_year, marked_at);


ALTER TABLE public.attendance_log OWNER TO neondb_owner;

--
-- Name: attendance_log_2024; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2024 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2024 OWNER TO neondb_owner;

--
-- Name: attendance_log_2025; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2025 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2025 OWNER TO neondb_owner;

--
-- Name: attendance_log_2026; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2026 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2026 OWNER TO neondb_owner;

--
-- Name: attendance_log_2027; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2027 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2027 OWNER TO neondb_owner;

--
-- Name: attendance_log_2028; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2028 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2028 OWNER TO neondb_owner;

--
-- Name: attendance_log_2029; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2029 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2029 OWNER TO neondb_owner;

--
-- Name: attendance_log_2030; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2030 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2030 OWNER TO neondb_owner;

--
-- Name: attendance_log_2031; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2031 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2031 OWNER TO neondb_owner;

--
-- Name: attendance_log_2032; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2032 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2032 OWNER TO neondb_owner;

--
-- Name: attendance_log_2033; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2033 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2033 OWNER TO neondb_owner;

--
-- Name: attendance_log_2034; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2034 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2034 OWNER TO neondb_owner;

--
-- Name: attendance_log_2035; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2035 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2035 OWNER TO neondb_owner;

--
-- Name: attendance_log_2036; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2036 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2036 OWNER TO neondb_owner;

--
-- Name: attendance_log_2037; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2037 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2037 OWNER TO neondb_owner;

--
-- Name: attendance_log_2038; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2038 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2038 OWNER TO neondb_owner;

--
-- Name: attendance_log_2039; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2039 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2039 OWNER TO neondb_owner;

--
-- Name: attendance_log_2040; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2040 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2040 OWNER TO neondb_owner;

--
-- Name: attendance_log_2041; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2041 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2041 OWNER TO neondb_owner;

--
-- Name: attendance_log_2042; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2042 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2042 OWNER TO neondb_owner;

--
-- Name: attendance_log_2043; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_log_2043 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    student_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    student_latitude numeric(9,6),
    student_longitude numeric(9,6),
    distance_meters numeric,
    auto_status public.attendance_status_enum NOT NULL,
    face_verified boolean DEFAULT false,
    final_status public.attendance_status_enum,
    teacher_comment text,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.attendance_log_2043 OWNER TO neondb_owner;

--
-- Name: attendance_session; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_session (
    session_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_info_id uuid NOT NULL,
    session_start timestamp with time zone NOT NULL,
    session_end timestamp with time zone NOT NULL,
    teacher_latitude numeric(9,6) NOT NULL,
    teacher_longitude numeric(9,6) NOT NULL,
    gps_radius_meters integer NOT NULL,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL,
    institute_id uuid NOT NULL,
    department_id uuid NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.attendance_session OWNER TO neondb_owner;

--
-- Name: attendance_session_card; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.attendance_session_card (
    session_id uuid NOT NULL,
    card_id character varying(20) NOT NULL,
    class_id character varying(20) NOT NULL,
    subject_id character varying(20) NOT NULL
);


ALTER TABLE public.attendance_session_card OWNER TO neondb_owner;

--
-- Name: batch; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.batch (
    batch_id character varying(20) NOT NULL,
    name text NOT NULL,
    description text,
    short text,
    class_id character varying(20) NOT NULL,
    timetable_id uuid NOT NULL
);


ALTER TABLE public.batch OWNER TO neondb_owner;

--
-- Name: card; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.card (
    lesson_id character varying(20) NOT NULL,
    period integer NOT NULL,
    weeks integer,
    days text,
    timetable_id uuid,
    classroom_ids character varying(20)[]
);


ALTER TABLE public.card OWNER TO neondb_owner;

--
-- Name: class; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.class (
    name text NOT NULL,
    description text,
    department_id uuid NOT NULL,
    institute_id uuid NOT NULL,
    timetable_id uuid NOT NULL,
    class_id character varying(20) NOT NULL,
    short text
);


ALTER TABLE public.class OWNER TO neondb_owner;

--
-- Name: classroom; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.classroom (
    name text NOT NULL,
    short text,
    timetable_id uuid,
    classroom_id character varying(20) NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    latitude numeric(9,6),
    longitude numeric(9,6),
    radius integer
);


ALTER TABLE public.classroom OWNER TO neondb_owner;

--
-- Name: daily_attendance_summary; Type: MATERIALIZED VIEW; Schema: public; Owner: neondb_owner
--

CREATE MATERIALIZED VIEW public.daily_attendance_summary AS
 SELECT date(marked_at) AS attendance_date,
    session_id,
    count(*) AS total_marked,
    count(
        CASE
            WHEN (auto_status = 'present'::public.attendance_status_enum) THEN 1
            ELSE NULL::integer
        END) AS present_count,
    count(
        CASE
            WHEN (face_verified = true) THEN 1
            ELSE NULL::integer
        END) AS face_verified_count,
    max(marked_at) AS last_update
   FROM public.attendance_log
  WHERE (marked_at >= (CURRENT_DATE - '30 days'::interval))
  GROUP BY (date(marked_at)), session_id
  WITH NO DATA;


ALTER MATERIALIZED VIEW public.daily_attendance_summary OWNER TO neondb_owner;

--
-- Name: daysdefs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.daysdefs (
    name text NOT NULL,
    short text,
    days integer NOT NULL,
    timetable_id uuid,
    daysdefs_id character varying(20) NOT NULL
);


ALTER TABLE public.daysdefs OWNER TO neondb_owner;

--
-- Name: department; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.department (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    institute_id uuid NOT NULL
);


ALTER TABLE public.department OWNER TO neondb_owner;

--
-- Name: group; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."group" (
    name text NOT NULL,
    class_id character varying(20) NOT NULL,
    entire_class boolean DEFAULT false NOT NULL,
    division_tag integer DEFAULT 0,
    timetable_id uuid,
    group_id character varying(20) NOT NULL,
    student_ids character varying(20)[]
);


ALTER TABLE public."group" OWNER TO neondb_owner;

--
-- Name: institute; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.institute (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    address text,
    email text,
    phone character varying(20)
);


ALTER TABLE public.institute OWNER TO neondb_owner;

--
-- Name: lesson; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.lesson (
    timetable_id uuid NOT NULL,
    class_ids character varying(20)[],
    subject_id character varying(20) NOT NULL,
    periods_per_card integer,
    period_per_week integer,
    lesson_type public.lesson_type_enum NOT NULL,
    classroom_ids character varying(20)[],
    group_ids character varying(20)[],
    weeks_def_id character varying(20) NOT NULL,
    days_def_id character varying(20) NOT NULL,
    lesson_id character varying(20) NOT NULL,
    teacher_ids character varying(20)[]
);


ALTER TABLE public.lesson OWNER TO neondb_owner;

--
-- Name: periods; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.periods (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    short text,
    period integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    timetable_id uuid
);


ALTER TABLE public.periods OWNER TO neondb_owner;

--
-- Name: semester; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.semester (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    semester_year_id uuid NOT NULL,
    semester_number integer NOT NULL
);


ALTER TABLE public.semester OWNER TO neondb_owner;

--
-- Name: semester_year; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.semester_year (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    semester_type character varying(4),
    academic_year_id uuid NOT NULL,
    institute_id uuid NOT NULL,
    CONSTRAINT semester_year_semester_type_check CHECK (((semester_type)::text = ANY ((ARRAY['odd'::character varying, 'even'::character varying])::text[])))
);


ALTER TABLE public.semester_year OWNER TO neondb_owner;

--
-- Name: session; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.session (
    session_id uuid DEFAULT gen_random_uuid() NOT NULL,
    classroom_id character varying(20) NOT NULL,
    lesson_id character varying(20),
    teacher_id character varying(20),
    start_time timestamp with time zone DEFAULT now(),
    end_time timestamp with time zone,
    is_active boolean DEFAULT true,
    period integer
);


ALTER TABLE public.session OWNER TO neondb_owner;

--
-- Name: student_enrollment_information; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.student_enrollment_information (
    class_id character varying(20) NOT NULL,
    group_id character varying(20),
    semester_id uuid NOT NULL,
    timetable_id uuid NOT NULL,
    user_id text NOT NULL,
    enrollment_id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE public.student_enrollment_information OWNER TO neondb_owner;

--
-- Name: student_face_cache; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.student_face_cache (
    student_id character varying(20) NOT NULL,
    face_encoding bytea,
    last_updated timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true
);


ALTER TABLE public.student_face_cache OWNER TO neondb_owner;

--
-- Name: subject; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.subject (
    name text NOT NULL,
    short text,
    timetable_id uuid,
    subject_id character varying(20) NOT NULL
);


ALTER TABLE public.subject OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
)
PARTITION BY RANGE (academic_year, marked_at);


ALTER TABLE public.teacher_attendance_log OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2020; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2020 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2020 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2021; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2021 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2021 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2022; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2022 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2022 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2023; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2023 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2023 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2024; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2024 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2024 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2025; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2025 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2025 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2026; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2026 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2026 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2027; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2027 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2027 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2028; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2028 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2028 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2029; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2029 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2029 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2030; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2030 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2030 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2031; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2031 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2031 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2032; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2032 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2032 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2033; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2033 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2033 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2034; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2034 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2034 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2035; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2035 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2035 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2036; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2036 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2036 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2037; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2037 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2037 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2038; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2038 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2038 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2039; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2039 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2039 OWNER TO neondb_owner;

--
-- Name: teacher_attendance_log_y2040; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_attendance_log_y2040 (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id character varying(20) NOT NULL,
    marked_at timestamp with time zone DEFAULT now() NOT NULL,
    teacher_latitude numeric(9,6),
    teacher_longitude numeric(9,6),
    face_verified boolean DEFAULT false,
    academic_year integer DEFAULT EXTRACT(year FROM now()) NOT NULL
);


ALTER TABLE public.teacher_attendance_log_y2040 OWNER TO neondb_owner;

--
-- Name: teacher_enrollment_info; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.teacher_enrollment_info (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    short text,
    color character varying(7),
    timetable_id uuid,
    tt_display_full_name text NOT NULL,
    user_id character varying(20) NOT NULL,
    enrollment_id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE public.teacher_enrollment_info OWNER TO neondb_owner;

--
-- Name: timetable; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.timetable (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    academic_calendar_id uuid NOT NULL,
    department_id uuid NOT NULL
);


ALTER TABLE public.timetable OWNER TO neondb_owner;

--
-- Name: user_authentication; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_authentication (
    auth_id uuid DEFAULT gen_random_uuid() NOT NULL,
    email_id text NOT NULL,
    password text NOT NULL,
    user_info_id uuid NOT NULL
);


ALTER TABLE public.user_authentication OWNER TO neondb_owner;

--
-- Name: user_info; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_info (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(20),
    full_name text NOT NULL,
    mobile_no character varying(20),
    email_id text,
    institute_id uuid,
    dept_id uuid,
    user_role public.user_role_enum NOT NULL,
    institute_email_id text,
    parents_mobile_no character varying(15),
    parents_email_id character varying(255),
    address text,
    city character varying(100),
    state character varying(100),
    country character varying(100),
    types_of_joining character varying(50),
    gender character(1),
    CONSTRAINT user_info_gender_check CHECK ((gender = ANY (ARRAY['M'::bpchar, 'F'::bpchar, 'O'::bpchar])))
);


ALTER TABLE public.user_info OWNER TO neondb_owner;

--
-- Name: weeksdefs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.weeksdefs (
    name text NOT NULL,
    short text,
    weeks integer NOT NULL,
    timetable_id uuid,
    weeksdefs_id character varying(20) NOT NULL
);


ALTER TABLE public.weeksdefs OWNER TO neondb_owner;

--
-- Name: attendance_log_2024; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2024 FOR VALUES FROM (2024, '2024-01-01 00:00:00+00') TO (2025, '2025-01-01 00:00:00+00');


--
-- Name: attendance_log_2025; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2025 FOR VALUES FROM (2025, '2025-01-01 00:00:00+00') TO (2026, '2026-01-01 00:00:00+00');


--
-- Name: attendance_log_2026; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2026 FOR VALUES FROM (2026, '2026-01-01 00:00:00+00') TO (2027, '2027-01-01 00:00:00+00');


--
-- Name: attendance_log_2027; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2027 FOR VALUES FROM (2027, '2027-01-01 00:00:00+00') TO (2028, '2028-01-01 00:00:00+00');


--
-- Name: attendance_log_2028; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2028 FOR VALUES FROM (2028, '2028-01-01 00:00:00+00') TO (2029, '2029-01-01 00:00:00+00');


--
-- Name: attendance_log_2029; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2029 FOR VALUES FROM (2029, '2029-01-01 00:00:00+00') TO (2030, '2030-01-01 00:00:00+00');


--
-- Name: attendance_log_2030; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2030 FOR VALUES FROM (2030, '2030-01-01 00:00:00+00') TO (2031, '2031-01-01 00:00:00+00');


--
-- Name: attendance_log_2031; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2031 FOR VALUES FROM (2031, '2031-01-01 00:00:00+00') TO (2032, '2032-01-01 00:00:00+00');


--
-- Name: attendance_log_2032; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2032 FOR VALUES FROM (2032, '2032-01-01 00:00:00+00') TO (2033, '2033-01-01 00:00:00+00');


--
-- Name: attendance_log_2033; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2033 FOR VALUES FROM (2033, '2033-01-01 00:00:00+00') TO (2034, '2034-01-01 00:00:00+00');


--
-- Name: attendance_log_2034; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2034 FOR VALUES FROM (2034, '2034-01-01 00:00:00+00') TO (2035, '2035-01-01 00:00:00+00');


--
-- Name: attendance_log_2035; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2035 FOR VALUES FROM (2035, '2035-01-01 00:00:00+00') TO (2036, '2036-01-01 00:00:00+00');


--
-- Name: attendance_log_2036; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2036 FOR VALUES FROM (2036, '2036-01-01 00:00:00+00') TO (2037, '2037-01-01 00:00:00+00');


--
-- Name: attendance_log_2037; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2037 FOR VALUES FROM (2037, '2037-01-01 00:00:00+00') TO (2038, '2038-01-01 00:00:00+00');


--
-- Name: attendance_log_2038; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2038 FOR VALUES FROM (2038, '2038-01-01 00:00:00+00') TO (2039, '2039-01-01 00:00:00+00');


--
-- Name: attendance_log_2039; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2039 FOR VALUES FROM (2039, '2039-01-01 00:00:00+00') TO (2040, '2040-01-01 00:00:00+00');


--
-- Name: attendance_log_2040; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2040 FOR VALUES FROM (2040, '2040-01-01 00:00:00+00') TO (2041, '2041-01-01 00:00:00+00');


--
-- Name: attendance_log_2041; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2041 FOR VALUES FROM (2041, '2041-01-01 00:00:00+00') TO (2042, '2042-01-01 00:00:00+00');


--
-- Name: attendance_log_2042; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2042 FOR VALUES FROM (2042, '2042-01-01 00:00:00+00') TO (2043, '2043-01-01 00:00:00+00');


--
-- Name: attendance_log_2043; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log ATTACH PARTITION public.attendance_log_2043 FOR VALUES FROM (2043, '2043-01-01 00:00:00+00') TO (2044, '2044-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2020; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2020 FOR VALUES FROM (2020, '2020-01-01 00:00:00+00') TO (2021, '2021-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2021; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2021 FOR VALUES FROM (2021, '2021-01-01 00:00:00+00') TO (2022, '2022-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2022; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2022 FOR VALUES FROM (2022, '2022-01-01 00:00:00+00') TO (2023, '2023-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2023; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2023 FOR VALUES FROM (2023, '2023-01-01 00:00:00+00') TO (2024, '2024-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2024; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2024 FOR VALUES FROM (2024, '2024-01-01 00:00:00+00') TO (2025, '2025-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2025; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2025 FOR VALUES FROM (2025, '2025-01-01 00:00:00+00') TO (2026, '2026-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2026; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2026 FOR VALUES FROM (2026, '2026-01-01 00:00:00+00') TO (2027, '2027-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2027; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2027 FOR VALUES FROM (2027, '2027-01-01 00:00:00+00') TO (2028, '2028-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2028; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2028 FOR VALUES FROM (2028, '2028-01-01 00:00:00+00') TO (2029, '2029-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2029; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2029 FOR VALUES FROM (2029, '2029-01-01 00:00:00+00') TO (2030, '2030-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2030; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2030 FOR VALUES FROM (2030, '2030-01-01 00:00:00+00') TO (2031, '2031-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2031; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2031 FOR VALUES FROM (2031, '2031-01-01 00:00:00+00') TO (2032, '2032-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2032; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2032 FOR VALUES FROM (2032, '2032-01-01 00:00:00+00') TO (2033, '2033-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2033; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2033 FOR VALUES FROM (2033, '2033-01-01 00:00:00+00') TO (2034, '2034-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2034; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2034 FOR VALUES FROM (2034, '2034-01-01 00:00:00+00') TO (2035, '2035-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2035; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2035 FOR VALUES FROM (2035, '2035-01-01 00:00:00+00') TO (2036, '2036-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2036; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2036 FOR VALUES FROM (2036, '2036-01-01 00:00:00+00') TO (2037, '2037-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2037; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2037 FOR VALUES FROM (2037, '2037-01-01 00:00:00+00') TO (2038, '2038-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2038; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2038 FOR VALUES FROM (2038, '2038-01-01 00:00:00+00') TO (2039, '2039-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2039; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2039 FOR VALUES FROM (2039, '2039-01-01 00:00:00+00') TO (2040, '2040-01-01 00:00:00+00');


--
-- Name: teacher_attendance_log_y2040; Type: TABLE ATTACH; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log ATTACH PARTITION public.teacher_attendance_log_y2040 FOR VALUES FROM (2040, '2040-01-01 00:00:00+00') TO (2041, '2041-01-01 00:00:00+00');


--
-- Name: academic_calendar academic_calendar_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.academic_calendar
    ADD CONSTRAINT academic_calendar_pkey PRIMARY KEY (id);


--
-- Name: academic_year academic_year_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.academic_year
    ADD CONSTRAINT academic_year_pkey PRIMARY KEY (id);


--
-- Name: attendance_log attendance_log_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log
    ADD CONSTRAINT attendance_log_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2024 attendance_log_2024_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2024
    ADD CONSTRAINT attendance_log_2024_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2025 attendance_log_2025_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2025
    ADD CONSTRAINT attendance_log_2025_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2026 attendance_log_2026_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2026
    ADD CONSTRAINT attendance_log_2026_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2027 attendance_log_2027_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2027
    ADD CONSTRAINT attendance_log_2027_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2028 attendance_log_2028_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2028
    ADD CONSTRAINT attendance_log_2028_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2029 attendance_log_2029_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2029
    ADD CONSTRAINT attendance_log_2029_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2030 attendance_log_2030_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2030
    ADD CONSTRAINT attendance_log_2030_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2031 attendance_log_2031_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2031
    ADD CONSTRAINT attendance_log_2031_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2032 attendance_log_2032_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2032
    ADD CONSTRAINT attendance_log_2032_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2033 attendance_log_2033_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2033
    ADD CONSTRAINT attendance_log_2033_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2034 attendance_log_2034_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2034
    ADD CONSTRAINT attendance_log_2034_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2035 attendance_log_2035_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2035
    ADD CONSTRAINT attendance_log_2035_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2036 attendance_log_2036_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2036
    ADD CONSTRAINT attendance_log_2036_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2037 attendance_log_2037_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2037
    ADD CONSTRAINT attendance_log_2037_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2038 attendance_log_2038_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2038
    ADD CONSTRAINT attendance_log_2038_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2039 attendance_log_2039_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2039
    ADD CONSTRAINT attendance_log_2039_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2040 attendance_log_2040_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2040
    ADD CONSTRAINT attendance_log_2040_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2041 attendance_log_2041_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2041
    ADD CONSTRAINT attendance_log_2041_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2042 attendance_log_2042_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2042
    ADD CONSTRAINT attendance_log_2042_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_log_2043 attendance_log_2043_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_log_2043
    ADD CONSTRAINT attendance_log_2043_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: attendance_session_card attendance_session_card_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_session_card
    ADD CONSTRAINT attendance_session_card_pkey PRIMARY KEY (session_id, card_id);


--
-- Name: attendance_session attendance_session_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.attendance_session
    ADD CONSTRAINT attendance_session_pkey PRIMARY KEY (session_id);


--
-- Name: batch batch_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.batch
    ADD CONSTRAINT batch_pkey PRIMARY KEY (batch_id);


--
-- Name: class class_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.class
    ADD CONSTRAINT class_pkey PRIMARY KEY (class_id);


--
-- Name: classroom classroom_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.classroom
    ADD CONSTRAINT classroom_pkey PRIMARY KEY (classroom_id);


--
-- Name: daysdefs daysdefs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.daysdefs
    ADD CONSTRAINT daysdefs_pkey PRIMARY KEY (daysdefs_id);


--
-- Name: department department_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (id);


--
-- Name: group group_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_pkey PRIMARY KEY (group_id);


--
-- Name: institute institute_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.institute
    ADD CONSTRAINT institute_pkey PRIMARY KEY (id);


--
-- Name: lesson lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lesson
    ADD CONSTRAINT lesson_pkey PRIMARY KEY (lesson_id);


--
-- Name: periods periods_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.periods
    ADD CONSTRAINT periods_pkey PRIMARY KEY (id);


--
-- Name: semester semester_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.semester
    ADD CONSTRAINT semester_pkey PRIMARY KEY (id);


--
-- Name: semester_year semester_year_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.semester_year
    ADD CONSTRAINT semester_year_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (session_id);


--
-- Name: student_enrollment_information student_enrollment_information_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_enrollment_information
    ADD CONSTRAINT student_enrollment_information_pkey PRIMARY KEY (enrollment_id);


--
-- Name: student_face_cache student_face_cache_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_face_cache
    ADD CONSTRAINT student_face_cache_pkey PRIMARY KEY (student_id);


--
-- Name: subject subject_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subject
    ADD CONSTRAINT subject_pkey PRIMARY KEY (subject_id);


--
-- Name: teacher_attendance_log teacher_attendance_log_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log
    ADD CONSTRAINT teacher_attendance_log_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2020 teacher_attendance_log_y2020_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2020
    ADD CONSTRAINT teacher_attendance_log_y2020_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2021 teacher_attendance_log_y2021_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2021
    ADD CONSTRAINT teacher_attendance_log_y2021_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2022 teacher_attendance_log_y2022_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2022
    ADD CONSTRAINT teacher_attendance_log_y2022_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2023 teacher_attendance_log_y2023_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2023
    ADD CONSTRAINT teacher_attendance_log_y2023_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2024 teacher_attendance_log_y2024_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2024
    ADD CONSTRAINT teacher_attendance_log_y2024_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2025 teacher_attendance_log_y2025_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2025
    ADD CONSTRAINT teacher_attendance_log_y2025_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2026 teacher_attendance_log_y2026_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2026
    ADD CONSTRAINT teacher_attendance_log_y2026_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2027 teacher_attendance_log_y2027_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2027
    ADD CONSTRAINT teacher_attendance_log_y2027_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2028 teacher_attendance_log_y2028_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2028
    ADD CONSTRAINT teacher_attendance_log_y2028_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2029 teacher_attendance_log_y2029_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2029
    ADD CONSTRAINT teacher_attendance_log_y2029_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2030 teacher_attendance_log_y2030_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2030
    ADD CONSTRAINT teacher_attendance_log_y2030_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2031 teacher_attendance_log_y2031_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2031
    ADD CONSTRAINT teacher_attendance_log_y2031_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2032 teacher_attendance_log_y2032_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2032
    ADD CONSTRAINT teacher_attendance_log_y2032_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2033 teacher_attendance_log_y2033_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2033
    ADD CONSTRAINT teacher_attendance_log_y2033_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2034 teacher_attendance_log_y2034_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2034
    ADD CONSTRAINT teacher_attendance_log_y2034_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2035 teacher_attendance_log_y2035_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2035
    ADD CONSTRAINT teacher_attendance_log_y2035_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2036 teacher_attendance_log_y2036_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2036
    ADD CONSTRAINT teacher_attendance_log_y2036_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2037 teacher_attendance_log_y2037_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2037
    ADD CONSTRAINT teacher_attendance_log_y2037_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2038 teacher_attendance_log_y2038_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2038
    ADD CONSTRAINT teacher_attendance_log_y2038_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2039 teacher_attendance_log_y2039_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2039
    ADD CONSTRAINT teacher_attendance_log_y2039_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_attendance_log_y2040 teacher_attendance_log_y2040_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_attendance_log_y2040
    ADD CONSTRAINT teacher_attendance_log_y2040_pkey PRIMARY KEY (log_id, academic_year, marked_at);


--
-- Name: teacher_enrollment_info teacher_enrollment_info_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_enrollment_info
    ADD CONSTRAINT teacher_enrollment_info_pkey PRIMARY KEY (enrollment_id);


--
-- Name: timetable timetable_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.timetable
    ADD CONSTRAINT timetable_pkey PRIMARY KEY (id);


--
-- Name: student_enrollment_information unique_student_semester; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_enrollment_information
    ADD CONSTRAINT unique_student_semester UNIQUE (user_id, semester_id);


--
-- Name: user_authentication user_authentication_email_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_authentication
    ADD CONSTRAINT user_authentication_email_id_key UNIQUE (email_id);


--
-- Name: user_authentication user_authentication_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_authentication
    ADD CONSTRAINT user_authentication_pkey PRIMARY KEY (auth_id);


--
-- Name: user_info user_info_email_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_email_id_key UNIQUE (email_id);


--
-- Name: user_info user_info_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_pkey PRIMARY KEY (id);


--
-- Name: user_info user_info_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_user_id_unique UNIQUE (user_id);


--
-- Name: weeksdefs weeksdefs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.weeksdefs
    ADD CONSTRAINT weeksdefs_pkey PRIMARY KEY (weeksdefs_id);


--
-- Name: idx_attendance_academic_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_attendance_academic_date ON ONLY public.attendance_log USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2024_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2024_academic_year_marked_at_idx ON public.attendance_log_2024 USING btree (academic_year, marked_at);


--
-- Name: idx_attendance_face_verified; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_attendance_face_verified ON ONLY public.attendance_log USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2024_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2024_face_verified_marked_at_idx ON public.attendance_log_2024 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2024_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2024_marked_at_idx ON public.attendance_log_2024 USING btree (marked_at);


--
-- Name: idx_attendance_session_student; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_attendance_session_student ON ONLY public.attendance_log USING btree (session_id, student_id);


--
-- Name: attendance_log_2024_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2024_session_id_student_id_idx ON public.attendance_log_2024 USING btree (session_id, student_id);


--
-- Name: idx_att_session_student; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_att_session_student ON ONLY public.attendance_log USING btree (session_id, student_id);


--
-- Name: attendance_log_2024_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2024_session_id_student_id_idx1 ON public.attendance_log_2024 USING btree (session_id, student_id);


--
-- Name: idx_att_student_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_att_student_date ON ONLY public.attendance_log USING btree (student_id, marked_at);


--
-- Name: attendance_log_2024_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2024_student_id_marked_at_idx ON public.attendance_log_2024 USING btree (student_id, marked_at);


--
-- Name: idx_attendance_student_time; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_attendance_student_time ON ONLY public.attendance_log USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2024_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2024_student_id_marked_at_idx1 ON public.attendance_log_2024 USING btree (student_id, marked_at DESC);


--
-- Name: idx_attendance_location; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_attendance_location ON ONLY public.attendance_log USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2024_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2024_student_latitude_student_longitude_idx ON public.attendance_log_2024 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2024_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2024_student_session_idx ON public.attendance_log_2024 USING btree (student_id, session_id);


--
-- Name: attendance_log_2025_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2025_academic_year_marked_at_idx ON public.attendance_log_2025 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2025_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2025_face_verified_marked_at_idx ON public.attendance_log_2025 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2025_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2025_marked_at_idx ON public.attendance_log_2025 USING btree (marked_at);


--
-- Name: attendance_log_2025_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2025_session_id_student_id_idx ON public.attendance_log_2025 USING btree (session_id, student_id);


--
-- Name: attendance_log_2025_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2025_session_id_student_id_idx1 ON public.attendance_log_2025 USING btree (session_id, student_id);


--
-- Name: attendance_log_2025_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2025_student_id_marked_at_idx ON public.attendance_log_2025 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2025_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2025_student_id_marked_at_idx1 ON public.attendance_log_2025 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2025_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2025_student_latitude_student_longitude_idx ON public.attendance_log_2025 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2025_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2025_student_session_idx ON public.attendance_log_2025 USING btree (student_id, session_id);


--
-- Name: attendance_log_2026_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2026_academic_year_marked_at_idx ON public.attendance_log_2026 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2026_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2026_face_verified_marked_at_idx ON public.attendance_log_2026 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2026_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2026_marked_at_idx ON public.attendance_log_2026 USING btree (marked_at);


--
-- Name: attendance_log_2026_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2026_session_id_student_id_idx ON public.attendance_log_2026 USING btree (session_id, student_id);


--
-- Name: attendance_log_2026_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2026_session_id_student_id_idx1 ON public.attendance_log_2026 USING btree (session_id, student_id);


--
-- Name: attendance_log_2026_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2026_student_id_marked_at_idx ON public.attendance_log_2026 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2026_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2026_student_id_marked_at_idx1 ON public.attendance_log_2026 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2026_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2026_student_latitude_student_longitude_idx ON public.attendance_log_2026 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2026_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2026_student_session_idx ON public.attendance_log_2026 USING btree (student_id, session_id);


--
-- Name: attendance_log_2027_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2027_academic_year_marked_at_idx ON public.attendance_log_2027 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2027_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2027_face_verified_marked_at_idx ON public.attendance_log_2027 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2027_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2027_marked_at_idx ON public.attendance_log_2027 USING btree (marked_at);


--
-- Name: attendance_log_2027_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2027_session_id_student_id_idx ON public.attendance_log_2027 USING btree (session_id, student_id);


--
-- Name: attendance_log_2027_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2027_session_id_student_id_idx1 ON public.attendance_log_2027 USING btree (session_id, student_id);


--
-- Name: attendance_log_2027_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2027_student_id_marked_at_idx ON public.attendance_log_2027 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2027_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2027_student_id_marked_at_idx1 ON public.attendance_log_2027 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2027_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2027_student_latitude_student_longitude_idx ON public.attendance_log_2027 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2027_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2027_student_session_idx ON public.attendance_log_2027 USING btree (student_id, session_id);


--
-- Name: attendance_log_2028_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2028_academic_year_marked_at_idx ON public.attendance_log_2028 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2028_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2028_face_verified_marked_at_idx ON public.attendance_log_2028 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2028_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2028_marked_at_idx ON public.attendance_log_2028 USING btree (marked_at);


--
-- Name: attendance_log_2028_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2028_session_id_student_id_idx ON public.attendance_log_2028 USING btree (session_id, student_id);


--
-- Name: attendance_log_2028_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2028_session_id_student_id_idx1 ON public.attendance_log_2028 USING btree (session_id, student_id);


--
-- Name: attendance_log_2028_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2028_student_id_marked_at_idx ON public.attendance_log_2028 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2028_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2028_student_id_marked_at_idx1 ON public.attendance_log_2028 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2028_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2028_student_latitude_student_longitude_idx ON public.attendance_log_2028 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2028_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2028_student_session_idx ON public.attendance_log_2028 USING btree (student_id, session_id);


--
-- Name: attendance_log_2029_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2029_academic_year_marked_at_idx ON public.attendance_log_2029 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2029_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2029_face_verified_marked_at_idx ON public.attendance_log_2029 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2029_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2029_marked_at_idx ON public.attendance_log_2029 USING btree (marked_at);


--
-- Name: attendance_log_2029_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2029_session_id_student_id_idx ON public.attendance_log_2029 USING btree (session_id, student_id);


--
-- Name: attendance_log_2029_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2029_session_id_student_id_idx1 ON public.attendance_log_2029 USING btree (session_id, student_id);


--
-- Name: attendance_log_2029_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2029_student_id_marked_at_idx ON public.attendance_log_2029 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2029_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2029_student_id_marked_at_idx1 ON public.attendance_log_2029 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2029_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2029_student_latitude_student_longitude_idx ON public.attendance_log_2029 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2029_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2029_student_session_idx ON public.attendance_log_2029 USING btree (student_id, session_id);


--
-- Name: attendance_log_2030_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2030_academic_year_marked_at_idx ON public.attendance_log_2030 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2030_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2030_face_verified_marked_at_idx ON public.attendance_log_2030 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2030_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2030_marked_at_idx ON public.attendance_log_2030 USING btree (marked_at);


--
-- Name: attendance_log_2030_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2030_session_id_student_id_idx ON public.attendance_log_2030 USING btree (session_id, student_id);


--
-- Name: attendance_log_2030_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2030_session_id_student_id_idx1 ON public.attendance_log_2030 USING btree (session_id, student_id);


--
-- Name: attendance_log_2030_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2030_student_id_marked_at_idx ON public.attendance_log_2030 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2030_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2030_student_id_marked_at_idx1 ON public.attendance_log_2030 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2030_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2030_student_latitude_student_longitude_idx ON public.attendance_log_2030 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2030_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2030_student_session_idx ON public.attendance_log_2030 USING btree (student_id, session_id);


--
-- Name: attendance_log_2031_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2031_academic_year_marked_at_idx ON public.attendance_log_2031 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2031_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2031_face_verified_marked_at_idx ON public.attendance_log_2031 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2031_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2031_marked_at_idx ON public.attendance_log_2031 USING btree (marked_at);


--
-- Name: attendance_log_2031_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2031_session_id_student_id_idx ON public.attendance_log_2031 USING btree (session_id, student_id);


--
-- Name: attendance_log_2031_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2031_session_id_student_id_idx1 ON public.attendance_log_2031 USING btree (session_id, student_id);


--
-- Name: attendance_log_2031_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2031_student_id_marked_at_idx ON public.attendance_log_2031 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2031_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2031_student_id_marked_at_idx1 ON public.attendance_log_2031 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2031_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2031_student_latitude_student_longitude_idx ON public.attendance_log_2031 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2031_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2031_student_session_idx ON public.attendance_log_2031 USING btree (student_id, session_id);


--
-- Name: attendance_log_2032_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2032_academic_year_marked_at_idx ON public.attendance_log_2032 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2032_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2032_face_verified_marked_at_idx ON public.attendance_log_2032 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2032_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2032_marked_at_idx ON public.attendance_log_2032 USING btree (marked_at);


--
-- Name: attendance_log_2032_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2032_session_id_student_id_idx ON public.attendance_log_2032 USING btree (session_id, student_id);


--
-- Name: attendance_log_2032_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2032_session_id_student_id_idx1 ON public.attendance_log_2032 USING btree (session_id, student_id);


--
-- Name: attendance_log_2032_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2032_student_id_marked_at_idx ON public.attendance_log_2032 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2032_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2032_student_id_marked_at_idx1 ON public.attendance_log_2032 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2032_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2032_student_latitude_student_longitude_idx ON public.attendance_log_2032 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2032_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2032_student_session_idx ON public.attendance_log_2032 USING btree (student_id, session_id);


--
-- Name: attendance_log_2033_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2033_academic_year_marked_at_idx ON public.attendance_log_2033 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2033_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2033_face_verified_marked_at_idx ON public.attendance_log_2033 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2033_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2033_marked_at_idx ON public.attendance_log_2033 USING btree (marked_at);


--
-- Name: attendance_log_2033_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2033_session_id_student_id_idx ON public.attendance_log_2033 USING btree (session_id, student_id);


--
-- Name: attendance_log_2033_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2033_session_id_student_id_idx1 ON public.attendance_log_2033 USING btree (session_id, student_id);


--
-- Name: attendance_log_2033_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2033_student_id_marked_at_idx ON public.attendance_log_2033 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2033_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2033_student_id_marked_at_idx1 ON public.attendance_log_2033 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2033_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2033_student_latitude_student_longitude_idx ON public.attendance_log_2033 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2033_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2033_student_session_idx ON public.attendance_log_2033 USING btree (student_id, session_id);


--
-- Name: attendance_log_2034_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2034_academic_year_marked_at_idx ON public.attendance_log_2034 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2034_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2034_face_verified_marked_at_idx ON public.attendance_log_2034 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2034_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2034_marked_at_idx ON public.attendance_log_2034 USING btree (marked_at);


--
-- Name: attendance_log_2034_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2034_session_id_student_id_idx ON public.attendance_log_2034 USING btree (session_id, student_id);


--
-- Name: attendance_log_2034_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2034_session_id_student_id_idx1 ON public.attendance_log_2034 USING btree (session_id, student_id);


--
-- Name: attendance_log_2034_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2034_student_id_marked_at_idx ON public.attendance_log_2034 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2034_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2034_student_id_marked_at_idx1 ON public.attendance_log_2034 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2034_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2034_student_latitude_student_longitude_idx ON public.attendance_log_2034 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2034_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2034_student_session_idx ON public.attendance_log_2034 USING btree (student_id, session_id);


--
-- Name: attendance_log_2035_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2035_academic_year_marked_at_idx ON public.attendance_log_2035 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2035_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2035_face_verified_marked_at_idx ON public.attendance_log_2035 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2035_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2035_marked_at_idx ON public.attendance_log_2035 USING btree (marked_at);


--
-- Name: attendance_log_2035_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2035_session_id_student_id_idx ON public.attendance_log_2035 USING btree (session_id, student_id);


--
-- Name: attendance_log_2035_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2035_session_id_student_id_idx1 ON public.attendance_log_2035 USING btree (session_id, student_id);


--
-- Name: attendance_log_2035_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2035_student_id_marked_at_idx ON public.attendance_log_2035 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2035_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2035_student_id_marked_at_idx1 ON public.attendance_log_2035 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2035_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2035_student_latitude_student_longitude_idx ON public.attendance_log_2035 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2035_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2035_student_session_idx ON public.attendance_log_2035 USING btree (student_id, session_id);


--
-- Name: attendance_log_2036_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2036_academic_year_marked_at_idx ON public.attendance_log_2036 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2036_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2036_face_verified_marked_at_idx ON public.attendance_log_2036 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2036_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2036_marked_at_idx ON public.attendance_log_2036 USING btree (marked_at);


--
-- Name: attendance_log_2036_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2036_session_id_student_id_idx ON public.attendance_log_2036 USING btree (session_id, student_id);


--
-- Name: attendance_log_2036_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2036_session_id_student_id_idx1 ON public.attendance_log_2036 USING btree (session_id, student_id);


--
-- Name: attendance_log_2036_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2036_student_id_marked_at_idx ON public.attendance_log_2036 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2036_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2036_student_id_marked_at_idx1 ON public.attendance_log_2036 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2036_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2036_student_latitude_student_longitude_idx ON public.attendance_log_2036 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2036_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2036_student_session_idx ON public.attendance_log_2036 USING btree (student_id, session_id);


--
-- Name: attendance_log_2037_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2037_academic_year_marked_at_idx ON public.attendance_log_2037 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2037_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2037_face_verified_marked_at_idx ON public.attendance_log_2037 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2037_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2037_marked_at_idx ON public.attendance_log_2037 USING btree (marked_at);


--
-- Name: attendance_log_2037_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2037_session_id_student_id_idx ON public.attendance_log_2037 USING btree (session_id, student_id);


--
-- Name: attendance_log_2037_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2037_session_id_student_id_idx1 ON public.attendance_log_2037 USING btree (session_id, student_id);


--
-- Name: attendance_log_2037_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2037_student_id_marked_at_idx ON public.attendance_log_2037 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2037_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2037_student_id_marked_at_idx1 ON public.attendance_log_2037 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2037_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2037_student_latitude_student_longitude_idx ON public.attendance_log_2037 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2037_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2037_student_session_idx ON public.attendance_log_2037 USING btree (student_id, session_id);


--
-- Name: attendance_log_2038_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2038_academic_year_marked_at_idx ON public.attendance_log_2038 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2038_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2038_face_verified_marked_at_idx ON public.attendance_log_2038 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2038_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2038_marked_at_idx ON public.attendance_log_2038 USING btree (marked_at);


--
-- Name: attendance_log_2038_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2038_session_id_student_id_idx ON public.attendance_log_2038 USING btree (session_id, student_id);


--
-- Name: attendance_log_2038_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2038_session_id_student_id_idx1 ON public.attendance_log_2038 USING btree (session_id, student_id);


--
-- Name: attendance_log_2038_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2038_student_id_marked_at_idx ON public.attendance_log_2038 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2038_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2038_student_id_marked_at_idx1 ON public.attendance_log_2038 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2038_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2038_student_latitude_student_longitude_idx ON public.attendance_log_2038 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2038_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2038_student_session_idx ON public.attendance_log_2038 USING btree (student_id, session_id);


--
-- Name: attendance_log_2039_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2039_academic_year_marked_at_idx ON public.attendance_log_2039 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2039_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2039_face_verified_marked_at_idx ON public.attendance_log_2039 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2039_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2039_marked_at_idx ON public.attendance_log_2039 USING btree (marked_at);


--
-- Name: attendance_log_2039_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2039_session_id_student_id_idx ON public.attendance_log_2039 USING btree (session_id, student_id);


--
-- Name: attendance_log_2039_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2039_session_id_student_id_idx1 ON public.attendance_log_2039 USING btree (session_id, student_id);


--
-- Name: attendance_log_2039_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2039_student_id_marked_at_idx ON public.attendance_log_2039 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2039_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2039_student_id_marked_at_idx1 ON public.attendance_log_2039 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2039_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2039_student_latitude_student_longitude_idx ON public.attendance_log_2039 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2039_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2039_student_session_idx ON public.attendance_log_2039 USING btree (student_id, session_id);


--
-- Name: attendance_log_2040_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2040_academic_year_marked_at_idx ON public.attendance_log_2040 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2040_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2040_face_verified_marked_at_idx ON public.attendance_log_2040 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2040_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2040_marked_at_idx ON public.attendance_log_2040 USING btree (marked_at);


--
-- Name: attendance_log_2040_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2040_session_id_student_id_idx ON public.attendance_log_2040 USING btree (session_id, student_id);


--
-- Name: attendance_log_2040_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2040_session_id_student_id_idx1 ON public.attendance_log_2040 USING btree (session_id, student_id);


--
-- Name: attendance_log_2040_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2040_student_id_marked_at_idx ON public.attendance_log_2040 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2040_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2040_student_id_marked_at_idx1 ON public.attendance_log_2040 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2040_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2040_student_latitude_student_longitude_idx ON public.attendance_log_2040 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2040_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2040_student_session_idx ON public.attendance_log_2040 USING btree (student_id, session_id);


--
-- Name: attendance_log_2041_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2041_academic_year_marked_at_idx ON public.attendance_log_2041 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2041_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2041_face_verified_marked_at_idx ON public.attendance_log_2041 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2041_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2041_marked_at_idx ON public.attendance_log_2041 USING btree (marked_at);


--
-- Name: attendance_log_2041_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2041_session_id_student_id_idx ON public.attendance_log_2041 USING btree (session_id, student_id);


--
-- Name: attendance_log_2041_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2041_session_id_student_id_idx1 ON public.attendance_log_2041 USING btree (session_id, student_id);


--
-- Name: attendance_log_2041_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2041_student_id_marked_at_idx ON public.attendance_log_2041 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2041_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2041_student_id_marked_at_idx1 ON public.attendance_log_2041 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2041_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2041_student_latitude_student_longitude_idx ON public.attendance_log_2041 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2041_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2041_student_session_idx ON public.attendance_log_2041 USING btree (student_id, session_id);


--
-- Name: attendance_log_2042_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2042_academic_year_marked_at_idx ON public.attendance_log_2042 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2042_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2042_face_verified_marked_at_idx ON public.attendance_log_2042 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2042_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2042_marked_at_idx ON public.attendance_log_2042 USING btree (marked_at);


--
-- Name: attendance_log_2042_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2042_session_id_student_id_idx ON public.attendance_log_2042 USING btree (session_id, student_id);


--
-- Name: attendance_log_2042_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2042_session_id_student_id_idx1 ON public.attendance_log_2042 USING btree (session_id, student_id);


--
-- Name: attendance_log_2042_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2042_student_id_marked_at_idx ON public.attendance_log_2042 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2042_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2042_student_id_marked_at_idx1 ON public.attendance_log_2042 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2042_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2042_student_latitude_student_longitude_idx ON public.attendance_log_2042 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2042_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2042_student_session_idx ON public.attendance_log_2042 USING btree (student_id, session_id);


--
-- Name: attendance_log_2043_academic_year_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2043_academic_year_marked_at_idx ON public.attendance_log_2043 USING btree (academic_year, marked_at);


--
-- Name: attendance_log_2043_face_verified_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2043_face_verified_marked_at_idx ON public.attendance_log_2043 USING btree (face_verified, marked_at) WHERE (face_verified = true);


--
-- Name: attendance_log_2043_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2043_marked_at_idx ON public.attendance_log_2043 USING btree (marked_at);


--
-- Name: attendance_log_2043_session_id_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2043_session_id_student_id_idx ON public.attendance_log_2043 USING btree (session_id, student_id);


--
-- Name: attendance_log_2043_session_id_student_id_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2043_session_id_student_id_idx1 ON public.attendance_log_2043 USING btree (session_id, student_id);


--
-- Name: attendance_log_2043_student_id_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2043_student_id_marked_at_idx ON public.attendance_log_2043 USING btree (student_id, marked_at);


--
-- Name: attendance_log_2043_student_id_marked_at_idx1; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2043_student_id_marked_at_idx1 ON public.attendance_log_2043 USING btree (student_id, marked_at DESC);


--
-- Name: attendance_log_2043_student_latitude_student_longitude_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2043_student_latitude_student_longitude_idx ON public.attendance_log_2043 USING btree (student_latitude, student_longitude);


--
-- Name: attendance_log_2043_student_session_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX attendance_log_2043_student_session_idx ON public.attendance_log_2043 USING btree (student_id, session_id);


--
-- Name: idx_daily_summary_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_daily_summary_date ON public.daily_attendance_summary USING btree (attendance_date DESC);


--
-- Name: idx_session_academic; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_session_academic ON public.attendance_session USING btree (academic_year, institute_id, department_id);


--
-- Name: idx_session_card_lookup; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_session_card_lookup ON public.attendance_session_card USING btree (card_id, session_id);


--
-- Name: idx_session_teacher_active; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_session_teacher_active ON public.attendance_session USING btree (teacher_info_id, is_active, session_start);


--
-- Name: idx_session_time_range; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_session_time_range ON public.attendance_session USING btree (session_start, session_end);


--
-- Name: attendance_log_2024_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2024_academic_year_marked_at_idx;


--
-- Name: attendance_log_2024_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2024_face_verified_marked_at_idx;


--
-- Name: attendance_log_2024_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2024_pkey;


--
-- Name: attendance_log_2024_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2024_session_id_student_id_idx;


--
-- Name: attendance_log_2024_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2024_session_id_student_id_idx1;


--
-- Name: attendance_log_2024_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2024_student_id_marked_at_idx;


--
-- Name: attendance_log_2024_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2024_student_id_marked_at_idx1;


--
-- Name: attendance_log_2024_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2024_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2025_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2025_academic_year_marked_at_idx;


--
-- Name: attendance_log_2025_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2025_face_verified_marked_at_idx;


--
-- Name: attendance_log_2025_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2025_pkey;


--
-- Name: attendance_log_2025_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2025_session_id_student_id_idx;


--
-- Name: attendance_log_2025_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2025_session_id_student_id_idx1;


--
-- Name: attendance_log_2025_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2025_student_id_marked_at_idx;


--
-- Name: attendance_log_2025_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2025_student_id_marked_at_idx1;


--
-- Name: attendance_log_2025_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2025_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2026_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2026_academic_year_marked_at_idx;


--
-- Name: attendance_log_2026_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2026_face_verified_marked_at_idx;


--
-- Name: attendance_log_2026_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2026_pkey;


--
-- Name: attendance_log_2026_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2026_session_id_student_id_idx;


--
-- Name: attendance_log_2026_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2026_session_id_student_id_idx1;


--
-- Name: attendance_log_2026_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2026_student_id_marked_at_idx;


--
-- Name: attendance_log_2026_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2026_student_id_marked_at_idx1;


--
-- Name: attendance_log_2026_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2026_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2027_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2027_academic_year_marked_at_idx;


--
-- Name: attendance_log_2027_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2027_face_verified_marked_at_idx;


--
-- Name: attendance_log_2027_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2027_pkey;


--
-- Name: attendance_log_2027_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2027_session_id_student_id_idx;


--
-- Name: attendance_log_2027_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2027_session_id_student_id_idx1;


--
-- Name: attendance_log_2027_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2027_student_id_marked_at_idx;


--
-- Name: attendance_log_2027_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2027_student_id_marked_at_idx1;


--
-- Name: attendance_log_2027_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2027_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2028_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2028_academic_year_marked_at_idx;


--
-- Name: attendance_log_2028_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2028_face_verified_marked_at_idx;


--
-- Name: attendance_log_2028_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2028_pkey;


--
-- Name: attendance_log_2028_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2028_session_id_student_id_idx;


--
-- Name: attendance_log_2028_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2028_session_id_student_id_idx1;


--
-- Name: attendance_log_2028_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2028_student_id_marked_at_idx;


--
-- Name: attendance_log_2028_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2028_student_id_marked_at_idx1;


--
-- Name: attendance_log_2028_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2028_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2029_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2029_academic_year_marked_at_idx;


--
-- Name: attendance_log_2029_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2029_face_verified_marked_at_idx;


--
-- Name: attendance_log_2029_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2029_pkey;


--
-- Name: attendance_log_2029_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2029_session_id_student_id_idx;


--
-- Name: attendance_log_2029_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2029_session_id_student_id_idx1;


--
-- Name: attendance_log_2029_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2029_student_id_marked_at_idx;


--
-- Name: attendance_log_2029_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2029_student_id_marked_at_idx1;


--
-- Name: attendance_log_2029_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2029_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2030_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2030_academic_year_marked_at_idx;


--
-- Name: attendance_log_2030_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2030_face_verified_marked_at_idx;


--
-- Name: attendance_log_2030_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2030_pkey;


--
-- Name: attendance_log_2030_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2030_session_id_student_id_idx;


--
-- Name: attendance_log_2030_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2030_session_id_student_id_idx1;


--
-- Name: attendance_log_2030_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2030_student_id_marked_at_idx;


--
-- Name: attendance_log_2030_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2030_student_id_marked_at_idx1;


--
-- Name: attendance_log_2030_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2030_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2031_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2031_academic_year_marked_at_idx;


--
-- Name: attendance_log_2031_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2031_face_verified_marked_at_idx;


--
-- Name: attendance_log_2031_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2031_pkey;


--
-- Name: attendance_log_2031_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2031_session_id_student_id_idx;


--
-- Name: attendance_log_2031_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2031_session_id_student_id_idx1;


--
-- Name: attendance_log_2031_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2031_student_id_marked_at_idx;


--
-- Name: attendance_log_2031_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2031_student_id_marked_at_idx1;


--
-- Name: attendance_log_2031_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2031_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2032_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2032_academic_year_marked_at_idx;


--
-- Name: attendance_log_2032_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2032_face_verified_marked_at_idx;


--
-- Name: attendance_log_2032_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2032_pkey;


--
-- Name: attendance_log_2032_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2032_session_id_student_id_idx;


--
-- Name: attendance_log_2032_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2032_session_id_student_id_idx1;


--
-- Name: attendance_log_2032_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2032_student_id_marked_at_idx;


--
-- Name: attendance_log_2032_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2032_student_id_marked_at_idx1;


--
-- Name: attendance_log_2032_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2032_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2033_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2033_academic_year_marked_at_idx;


--
-- Name: attendance_log_2033_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2033_face_verified_marked_at_idx;


--
-- Name: attendance_log_2033_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2033_pkey;


--
-- Name: attendance_log_2033_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2033_session_id_student_id_idx;


--
-- Name: attendance_log_2033_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2033_session_id_student_id_idx1;


--
-- Name: attendance_log_2033_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2033_student_id_marked_at_idx;


--
-- Name: attendance_log_2033_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2033_student_id_marked_at_idx1;


--
-- Name: attendance_log_2033_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2033_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2034_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2034_academic_year_marked_at_idx;


--
-- Name: attendance_log_2034_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2034_face_verified_marked_at_idx;


--
-- Name: attendance_log_2034_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2034_pkey;


--
-- Name: attendance_log_2034_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2034_session_id_student_id_idx;


--
-- Name: attendance_log_2034_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2034_session_id_student_id_idx1;


--
-- Name: attendance_log_2034_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2034_student_id_marked_at_idx;


--
-- Name: attendance_log_2034_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2034_student_id_marked_at_idx1;


--
-- Name: attendance_log_2034_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2034_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2035_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2035_academic_year_marked_at_idx;


--
-- Name: attendance_log_2035_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2035_face_verified_marked_at_idx;


--
-- Name: attendance_log_2035_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2035_pkey;


--
-- Name: attendance_log_2035_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2035_session_id_student_id_idx;


--
-- Name: attendance_log_2035_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2035_session_id_student_id_idx1;


--
-- Name: attendance_log_2035_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2035_student_id_marked_at_idx;


--
-- Name: attendance_log_2035_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2035_student_id_marked_at_idx1;


--
-- Name: attendance_log_2035_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2035_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2036_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2036_academic_year_marked_at_idx;


--
-- Name: attendance_log_2036_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2036_face_verified_marked_at_idx;


--
-- Name: attendance_log_2036_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2036_pkey;


--
-- Name: attendance_log_2036_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2036_session_id_student_id_idx;


--
-- Name: attendance_log_2036_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2036_session_id_student_id_idx1;


--
-- Name: attendance_log_2036_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2036_student_id_marked_at_idx;


--
-- Name: attendance_log_2036_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2036_student_id_marked_at_idx1;


--
-- Name: attendance_log_2036_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2036_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2037_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2037_academic_year_marked_at_idx;


--
-- Name: attendance_log_2037_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2037_face_verified_marked_at_idx;


--
-- Name: attendance_log_2037_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2037_pkey;


--
-- Name: attendance_log_2037_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2037_session_id_student_id_idx;


--
-- Name: attendance_log_2037_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2037_session_id_student_id_idx1;


--
-- Name: attendance_log_2037_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2037_student_id_marked_at_idx;


--
-- Name: attendance_log_2037_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2037_student_id_marked_at_idx1;


--
-- Name: attendance_log_2037_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2037_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2038_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2038_academic_year_marked_at_idx;


--
-- Name: attendance_log_2038_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2038_face_verified_marked_at_idx;


--
-- Name: attendance_log_2038_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2038_pkey;


--
-- Name: attendance_log_2038_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2038_session_id_student_id_idx;


--
-- Name: attendance_log_2038_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2038_session_id_student_id_idx1;


--
-- Name: attendance_log_2038_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2038_student_id_marked_at_idx;


--
-- Name: attendance_log_2038_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2038_student_id_marked_at_idx1;


--
-- Name: attendance_log_2038_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2038_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2039_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2039_academic_year_marked_at_idx;


--
-- Name: attendance_log_2039_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2039_face_verified_marked_at_idx;


--
-- Name: attendance_log_2039_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2039_pkey;


--
-- Name: attendance_log_2039_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2039_session_id_student_id_idx;


--
-- Name: attendance_log_2039_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2039_session_id_student_id_idx1;


--
-- Name: attendance_log_2039_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2039_student_id_marked_at_idx;


--
-- Name: attendance_log_2039_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2039_student_id_marked_at_idx1;


--
-- Name: attendance_log_2039_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2039_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2040_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2040_academic_year_marked_at_idx;


--
-- Name: attendance_log_2040_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2040_face_verified_marked_at_idx;


--
-- Name: attendance_log_2040_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2040_pkey;


--
-- Name: attendance_log_2040_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2040_session_id_student_id_idx;


--
-- Name: attendance_log_2040_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2040_session_id_student_id_idx1;


--
-- Name: attendance_log_2040_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2040_student_id_marked_at_idx;


--
-- Name: attendance_log_2040_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2040_student_id_marked_at_idx1;


--
-- Name: attendance_log_2040_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2040_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2041_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2041_academic_year_marked_at_idx;


--
-- Name: attendance_log_2041_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2041_face_verified_marked_at_idx;


--
-- Name: attendance_log_2041_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2041_pkey;


--
-- Name: attendance_log_2041_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2041_session_id_student_id_idx;


--
-- Name: attendance_log_2041_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2041_session_id_student_id_idx1;


--
-- Name: attendance_log_2041_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2041_student_id_marked_at_idx;


--
-- Name: attendance_log_2041_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2041_student_id_marked_at_idx1;


--
-- Name: attendance_log_2041_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2041_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2042_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2042_academic_year_marked_at_idx;


--
-- Name: attendance_log_2042_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2042_face_verified_marked_at_idx;


--
-- Name: attendance_log_2042_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2042_pkey;


--
-- Name: attendance_log_2042_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2042_session_id_student_id_idx;


--
-- Name: attendance_log_2042_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2042_session_id_student_id_idx1;


--
-- Name: attendance_log_2042_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2042_student_id_marked_at_idx;


--
-- Name: attendance_log_2042_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2042_student_id_marked_at_idx1;


--
-- Name: attendance_log_2042_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2042_student_latitude_student_longitude_idx;


--
-- Name: attendance_log_2043_academic_year_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_academic_date ATTACH PARTITION public.attendance_log_2043_academic_year_marked_at_idx;


--
-- Name: attendance_log_2043_face_verified_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_face_verified ATTACH PARTITION public.attendance_log_2043_face_verified_marked_at_idx;


--
-- Name: attendance_log_2043_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.attendance_log_pkey ATTACH PARTITION public.attendance_log_2043_pkey;


--
-- Name: attendance_log_2043_session_id_student_id_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_session_student ATTACH PARTITION public.attendance_log_2043_session_id_student_id_idx;


--
-- Name: attendance_log_2043_session_id_student_id_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_session_student ATTACH PARTITION public.attendance_log_2043_session_id_student_id_idx1;


--
-- Name: attendance_log_2043_student_id_marked_at_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_att_student_date ATTACH PARTITION public.attendance_log_2043_student_id_marked_at_idx;


--
-- Name: attendance_log_2043_student_id_marked_at_idx1; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_student_time ATTACH PARTITION public.attendance_log_2043_student_id_marked_at_idx1;


--
-- Name: attendance_log_2043_student_latitude_student_longitude_idx; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.idx_attendance_location ATTACH PARTITION public.attendance_log_2043_student_latitude_student_longitude_idx;


--
-- Name: teacher_attendance_log_y2020_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2020_pkey;


--
-- Name: teacher_attendance_log_y2021_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2021_pkey;


--
-- Name: teacher_attendance_log_y2022_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2022_pkey;


--
-- Name: teacher_attendance_log_y2023_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2023_pkey;


--
-- Name: teacher_attendance_log_y2024_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2024_pkey;


--
-- Name: teacher_attendance_log_y2025_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2025_pkey;


--
-- Name: teacher_attendance_log_y2026_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2026_pkey;


--
-- Name: teacher_attendance_log_y2027_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2027_pkey;


--
-- Name: teacher_attendance_log_y2028_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2028_pkey;


--
-- Name: teacher_attendance_log_y2029_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2029_pkey;


--
-- Name: teacher_attendance_log_y2030_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2030_pkey;


--
-- Name: teacher_attendance_log_y2031_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2031_pkey;


--
-- Name: teacher_attendance_log_y2032_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2032_pkey;


--
-- Name: teacher_attendance_log_y2033_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2033_pkey;


--
-- Name: teacher_attendance_log_y2034_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2034_pkey;


--
-- Name: teacher_attendance_log_y2035_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2035_pkey;


--
-- Name: teacher_attendance_log_y2036_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2036_pkey;


--
-- Name: teacher_attendance_log_y2037_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2037_pkey;


--
-- Name: teacher_attendance_log_y2038_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2038_pkey;


--
-- Name: teacher_attendance_log_y2039_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2039_pkey;


--
-- Name: teacher_attendance_log_y2040_pkey; Type: INDEX ATTACH; Schema: public; Owner: neondb_owner
--

ALTER INDEX public.teacher_attendance_log_pkey ATTACH PARTITION public.teacher_attendance_log_y2040_pkey;


--
-- Name: academic_calendar academic_calendar_semester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.academic_calendar
    ADD CONSTRAINT academic_calendar_semester_id_fkey FOREIGN KEY (semester_id) REFERENCES public.semester_year(id) ON DELETE CASCADE;


--
-- Name: batch batch_timetable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.batch
    ADD CONSTRAINT batch_timetable_id_fkey FOREIGN KEY (timetable_id) REFERENCES public.timetable(id);


--
-- Name: card card_timetable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT card_timetable_id_fkey FOREIGN KEY (timetable_id) REFERENCES public.timetable(id) ON DELETE CASCADE;


--
-- Name: class class_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.class
    ADD CONSTRAINT class_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.department(id) ON DELETE CASCADE;


--
-- Name: class class_institute_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.class
    ADD CONSTRAINT class_institute_id_fkey FOREIGN KEY (institute_id) REFERENCES public.institute(id) ON DELETE CASCADE;


--
-- Name: class class_timetable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.class
    ADD CONSTRAINT class_timetable_id_fkey FOREIGN KEY (timetable_id) REFERENCES public.timetable(id) ON DELETE CASCADE;


--
-- Name: classroom classroom_timetable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.classroom
    ADD CONSTRAINT classroom_timetable_id_fkey FOREIGN KEY (timetable_id) REFERENCES public.timetable(id) ON DELETE CASCADE;


--
-- Name: daysdefs daysdefs_timetable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.daysdefs
    ADD CONSTRAINT daysdefs_timetable_id_fkey FOREIGN KEY (timetable_id) REFERENCES public.timetable(id) ON DELETE CASCADE;


--
-- Name: department department_institute_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_institute_id_fkey FOREIGN KEY (institute_id) REFERENCES public.institute(id) ON DELETE CASCADE;


--
-- Name: student_enrollment_information fk_class_id; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_enrollment_information
    ADD CONSTRAINT fk_class_id FOREIGN KEY (class_id) REFERENCES public.class(class_id) ON DELETE CASCADE;


--
-- Name: group fk_group_class_id; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT fk_group_class_id FOREIGN KEY (class_id) REFERENCES public.class(class_id) ON DELETE CASCADE;


--
-- Name: student_enrollment_information fk_group_id; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_enrollment_information
    ADD CONSTRAINT fk_group_id FOREIGN KEY (group_id) REFERENCES public."group"(group_id) ON DELETE CASCADE;


--
-- Name: card fk_lesson; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT fk_lesson FOREIGN KEY (lesson_id) REFERENCES public.lesson(lesson_id) ON DELETE CASCADE;


--
-- Name: lesson fk_lesson_days; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lesson
    ADD CONSTRAINT fk_lesson_days FOREIGN KEY (days_def_id) REFERENCES public.daysdefs(daysdefs_id) ON DELETE CASCADE;


--
-- Name: lesson fk_lesson_subject; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lesson
    ADD CONSTRAINT fk_lesson_subject FOREIGN KEY (subject_id) REFERENCES public.subject(subject_id) ON DELETE CASCADE;


--
-- Name: lesson fk_lesson_weeks; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lesson
    ADD CONSTRAINT fk_lesson_weeks FOREIGN KEY (weeks_def_id) REFERENCES public.weeksdefs(weeksdefs_id) ON DELETE CASCADE;


--
-- Name: student_enrollment_information fk_semester_id; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_enrollment_information
    ADD CONSTRAINT fk_semester_id FOREIGN KEY (semester_id) REFERENCES public.semester(id) ON DELETE CASCADE;


--
-- Name: teacher_enrollment_info fk_teacher_user_id; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_enrollment_info
    ADD CONSTRAINT fk_teacher_user_id FOREIGN KEY (user_id) REFERENCES public.user_info(user_id) ON DELETE CASCADE;


--
-- Name: student_enrollment_information fk_user_info_id; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_enrollment_information
    ADD CONSTRAINT fk_user_info_id FOREIGN KEY (user_id) REFERENCES public.user_info(user_id) ON DELETE CASCADE;


--
-- Name: group group_timetable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."group"
    ADD CONSTRAINT group_timetable_id_fkey FOREIGN KEY (timetable_id) REFERENCES public.timetable(id) ON DELETE CASCADE;


--
-- Name: lesson lesson_timetable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.lesson
    ADD CONSTRAINT lesson_timetable_id_fkey FOREIGN KEY (timetable_id) REFERENCES public.timetable(id) ON DELETE CASCADE;


--
-- Name: periods periods_timetable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.periods
    ADD CONSTRAINT periods_timetable_id_fkey FOREIGN KEY (timetable_id) REFERENCES public.timetable(id) ON DELETE CASCADE;


--
-- Name: semester semester_semester_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.semester
    ADD CONSTRAINT semester_semester_year_id_fkey FOREIGN KEY (semester_year_id) REFERENCES public.semester_year(id) ON DELETE CASCADE;


--
-- Name: semester_year semester_year_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.semester_year
    ADD CONSTRAINT semester_year_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_year(id) ON DELETE CASCADE;


--
-- Name: semester_year semester_year_institute_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.semester_year
    ADD CONSTRAINT semester_year_institute_id_fkey FOREIGN KEY (institute_id) REFERENCES public.institute(id) ON DELETE CASCADE;


--
-- Name: session session_classroom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_classroom_id_fkey FOREIGN KEY (classroom_id) REFERENCES public.classroom(classroom_id) ON DELETE CASCADE;


--
-- Name: student_enrollment_information student_enrollment_information_timetable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.student_enrollment_information
    ADD CONSTRAINT student_enrollment_information_timetable_id_fkey FOREIGN KEY (timetable_id) REFERENCES public.timetable(id) ON DELETE CASCADE;


--
-- Name: subject subject_timetable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subject
    ADD CONSTRAINT subject_timetable_id_fkey FOREIGN KEY (timetable_id) REFERENCES public.timetable(id) ON DELETE CASCADE;


--
-- Name: teacher_enrollment_info teacher_enrollment_info_timetable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.teacher_enrollment_info
    ADD CONSTRAINT teacher_enrollment_info_timetable_id_fkey FOREIGN KEY (timetable_id) REFERENCES public.timetable(id) ON DELETE CASCADE;


--
-- Name: timetable timetable_academic_calendar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.timetable
    ADD CONSTRAINT timetable_academic_calendar_id_fkey FOREIGN KEY (academic_calendar_id) REFERENCES public.academic_calendar(id) ON DELETE CASCADE;


--
-- Name: timetable timetable_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.timetable
    ADD CONSTRAINT timetable_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.department(id) ON DELETE CASCADE;


--
-- Name: user_authentication user_authentication_user_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_authentication
    ADD CONSTRAINT user_authentication_user_info_id_fkey FOREIGN KEY (user_info_id) REFERENCES public.user_info(id) ON DELETE CASCADE;


--
-- Name: user_info user_info_dept_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_dept_id_fkey FOREIGN KEY (dept_id) REFERENCES public.department(id) ON DELETE SET NULL;


--
-- Name: user_info user_info_institute_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_institute_id_fkey FOREIGN KEY (institute_id) REFERENCES public.institute(id) ON DELETE SET NULL;


--
-- Name: weeksdefs weeksdefs_timetable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.weeksdefs
    ADD CONSTRAINT weeksdefs_timetable_id_fkey FOREIGN KEY (timetable_id) REFERENCES public.timetable(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

