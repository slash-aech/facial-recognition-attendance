const { v4: uuidv4 } = require('uuid');
const timetablePool = require('../config/timetableDbPool');

const insertTimetableData = async (parsedData, meta) => {
    const client = await timetablePool.connect();
    const timetableId = uuidv4();

    try {
        await client.query('BEGIN');

        // 1. Insert into TIMETABLE
        await client.query(
            `INSERT INTO timetable (id, academic_calendar_id, department_id)
       VALUES ($1, $2, $3)`,
            [timetableId, meta.academicCalendarId, meta.departmentId]
        );

        const insertMany = async (data, query, getParams, validator = () => true) => {
            for (const item of data) {
                if (!validator(item)) {
                    throw new Error(`Validation failed for item: ${JSON.stringify(item)}`);
                }
                await client.query(query, getParams(item));
            }
        };

        // 2. Insert PERIODS
        await insertMany(
            parsedData.filter(p => p.type === 'period'),
            `INSERT INTO periods (id, name, short, period, start_time, end_time, timetable_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            p => [uuidv4(), p.name, p.short, p.period, p.starttime, p.endtime, timetableId]
        );

        // 3. Insert DAYDEFS
        await insertMany(
            parsedData.filter(p => p.type === 'daysdef'),
            `INSERT INTO daysdefs (daysdefs_id, name, short, days, timetable_id)
       VALUES ($1, $2, $3, $4, $5)`,
            d => [d.id, d.name, d.short, parseInt(d.days), timetableId]
        );

        // 4. Insert WEEKSDEFS
        await insertMany(
            parsedData.filter(p => p.type === 'weeksdef'),
            `INSERT INTO weeksdefs (weeksdefs_id, name, short, weeks, timetable_id)
       VALUES ($1, $2, $3, $4, $5)`,
            w => [w.id, w.name, w.short, parseInt(w.weeks), timetableId]
        );

        // 5. Insert SUBJECT
        await insertMany(
            parsedData.filter(p => p.type === 'subject'),
            `INSERT INTO subject (subject_id, name, short, timetable_id)
       VALUES ($1, $2, $3, $4)`,
            s => [s.id, s.name, s.short, timetableId]
        );

        // 6. Insert CLASSROOM
        await insertMany(
            parsedData.filter(p => p.type === 'classroom'),
            `INSERT INTO classroom (classroom_id, name, short, timetable_id)
       VALUES ($1, $2, $3, $4)`,
            r => [r.id, r.name, r.short, timetableId]
        );

        await insertMany(
            parsedData.filter(p => p.type === 'teacher'),
            `INSERT INTO teacher_enrollment_info (
            enrollment_id, user_id, short, color, timetable_id, tt_display_full_name
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            t => [
                uuidv4(),        // enrollment_id
                t.id,            // user_id
                t.short || '',   // short
                t.color || '#000000', // color
                timetableId,     // timetable_id
                t.name || ''     // tt_display_full_name
            ],
            t => !!t.id
);




        // 8. Insert CLASS
        await insertMany(
            parsedData.filter(p => p.type === 'class'),
            `INSERT INTO class (class_id, name, description,short, department_id, institute_id, timetable_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            c => [c.id, c.name, c.description, c.short, meta.departmentId, meta.instituteId, timetableId]
        );

        // 9. GROUPS
        await insertMany(
            parsedData.filter(p => p.type === 'group'),
            `INSERT INTO "group" (group_id, name, class_id, student_ids, entire_class, division_tag, timetable_id)
   VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            g => [
                g.id,
                g.name,
                g.classid, // ✅ fixed: was g.classId (wrong), now matches XML
                Array.isArray(g.studentids) ? g.studentids : g.studentids?.split(',') || [],
                g.entireclass || false,
                g.divisiontag || 0,
                timetableId
            ]
        );

        // 10. STUDENT ENROLLMENT
        await insertMany(
            parsedData.filter(p => p.type === 'student_enrollment'),
            `INSERT INTO student_enrollment_information (student_id, class_id, batch_id, semester_name, semester_id, timetable_id, email, mobile, firstname, lastname)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            s => [s.id, s.classid, s.batchid || null, s.semestername, meta.semesterId, timetableId, s.email, s.mobile, s.firstname, s.lastname],
            s => !!s.studentId
        );

        // 11. LESSON
        const lessons = parsedData.filter(p => p.type === 'lesson');

        // Optional: log all lessons missing subjectId
        // lessons.forEach((l, idx) => {
        //     if (!l.subjectId) {
        //         console.warn(`⚠️ Lesson at index ${idx} is missing subjectId:`, l);
        //     }
        // });

        // Proceed with insert
        await insertMany(
            lessons,
            `INSERT INTO lesson (
    lesson_id, timetable_id, class_ids, subject_id, 
    periods_per_card, period_per_week, lesson_type, 
    classroom_ids, group_ids, weeks_def_id, days_def_id
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            l => [
                l.id,
                timetableId,
                Array.isArray(l.classids) ? l.classids : l.classids?.split(',') || [],
                l.subjectid,
                l.periodspercard,
                l.periodperweek,
                l.periodspercard === 1 ? 'Lecture' : 'Lab',
                Array.isArray(l.classroomids) ? l.classroomids : l.classroomids?.split(',') || [],
                Array.isArray(l.groupids) ? l.groupids : l.groupids?.split(',') || [],
                l.weeksdefid,
                l.daysdefid
            ]
        );



        // 12. CARD
        await insertMany(
            parsedData.filter(p => p.type === 'card'),
            `INSERT INTO card (lesson_id, period, weeks, days, timetable_id, classroom_ids)
   VALUES ($1, $2, $3, $4, $5, $6)`,  // ← 7 placeholders
            c => [
                c.lessonid,
                c.period,
                c.weeks,
                c.days,
                timetableId,
                Array.isArray(c.classroomids) ? c.classroomids : c.classroomids?.split(',') || [],
            ]
        );


        // ✅ COMMIT all at once
        await client.query('COMMIT');
        console.log("done")
        return { success: true, timetableId };
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error inserting timetable data:', err);
        return { success: false, error: err.message };
    } finally {
        client.release();
    }
};

module.exports = { insertTimetableData };
