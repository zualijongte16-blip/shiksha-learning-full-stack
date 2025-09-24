# How to Add a New Teacher

This guide explains how to add a new teacher to the database in `backend/data/db.json`.

## Steps

1. **Open the Database File**:
   - Navigate to `backend/data/db.json` and open it in an editor.

2. **Add to Teachers Array**:
   - Locate the "teachers" array.
   - Add a new object at the end of the array with the following structure:
     ```json
     {
       "id": <next_id>,
       "name": "<teacher_name>",
       "email": "<teacher_email>",
       "teacherId": "<unique_teacher_id>",
       "subject": "<subject>",
       "department": "<department>",
       "phone": "<phone_number>",
       "students": [<array_of_student_emails>],
       "courses": [<array_of_course_names>],
       "tempPassword": "<teacher_id>"
     }
     ```
     - `<next_id>`: Use the next sequential number (e.g., if last is 5, use 6).
     - `<unique_teacher_id>`: A unique ID like "TEACH006".
     - `<array_of_student_emails>`: List of emails from the "students" array that this teacher will have.
     - `<array_of_course_names>`: List of course names this teacher will teach.
     - `tempPassword`: Set to the same as `teacherId` (e.g., "TEACH006"). This is the temporary password for the teacher.

3. **Update Students (if applicable)**:
   - If the teacher is assigned to specific students, ensure their emails are in the "students" array of the teacher object.
   - The student emails must match those in the "students" array.

4. **Update Courses (if applicable)**:
   - If the teacher is assigned to a course, update the "teacherId" in the relevant course object in the "courses" array.
   - For example, if the course has "teacherId": "TEACH001", change it to the new teacher's ID if assigned.

5. **Validate JSON**:
   - Ensure the JSON is valid (no trailing commas, proper brackets).
   - You can use online JSON validators or tools like `node -e "JSON.parse(require('fs').readFileSync('backend/data/db.json', 'utf8')); console.log('Valid');"` to check.

6. **Test the Changes**:
   - Restart the backend server if running.
   - Test the API endpoints to ensure the new teacher is accessible.

## Notes

- Teachers have unique IDs starting from "TEACH001".
- Temporary password is set to the teacher ID, and they can change it later.
- Ensure all referenced emails in "students" and "enrolledStudents" match the "students" array.

This ensures the database is consistent and the new teacher is properly integrated.
