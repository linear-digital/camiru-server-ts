import Center from "../modules/center/center.model";
import Staff from "../modules/staff/staff.model";
import Student from "../modules/student/student.model";

async function findUserById(id: string) {
    const [user, student, staff] = await Promise.all([
        Center.findByIdAndUpdate(id, { active: true }, { new: true }).select('firstName lastName active'),
        Student.findByIdAndUpdate(id, { active: true }, { new: true }).select('firstName lastName active'),
        Staff.findByIdAndUpdate(id, { active: true }, { new: true }).select('firstName lastName active'),
    ]);

    if (user) return user;
    if (student) return student;
    if (staff) return staff;

    return null;
}

export const makeInActive = async (id: string) => {
    const center = await Center.findByIdAndUpdate(id, { active: false }, { new: true }).select('firstName lastName active')
    if (center) {
        return center
    }
    const student = await Student.findByIdAndUpdate(id, { active: false }, { new: true }).select('firstName lastName active')
    if (student) {
        return student
    }
    const staff = await Staff.findByIdAndUpdate(id, { active: false }, { new: true }).select('firstName lastName active');
    return staff
}

export default findUserById