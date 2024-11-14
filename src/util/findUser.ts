import Center from "../modules/center/center.model";
import Staff from "../modules/staff/staff.model";
import Student from "../modules/student/student.model";

async function findUserById(id: string) {
    const [user, student, staff] = await Promise.all([
        Center.findById(id).select('firstName lastName'),
        Student.findById(id).select('firstName lastName'),
        Staff.findById(id).select('firstName lastName'),
    ]);

    if (user) return user;
    if (student) return student;
    if (staff) return staff;

    return null;
}

export default findUserById