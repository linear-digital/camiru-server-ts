import moment from "moment";
import { Query } from "../../type/common";
import Report from "../report/reports.model";
import { status } from "../report/status";
import Student, { IStudent } from "./student.model";
import bcrypt from 'bcrypt'
import ClassRoom from "../classroom/classroom.model";
import Staff from "../staff/staff.model";
import tokenGenerator from "../../util/generateToken";
const defaultValue = {
    limit: 20,
    page: 1
}

const createNew = async (user: IStudent): Promise<IStudent> => {
    try {
        user.birthDate = new Date(user.birthDate)
        user.enrollmentDate = new Date(user.enrollmentDate)
        // generate 15 digit id
        const date = new Date()
        const studentId = date.getTime()
        user.studentId = studentId
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash('123456', salt)
        user.password = hashedPassword
        const newUser = new Student(user)
        const data = await newUser.save()
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const login = async (body: { email: string, password: string }) => {
    try {
        const data = await Student.findOne({ email: body.email })
        if (!data) {
            throw new Error("User not found")
        }
        const isMatch = body.password === data.password
        if (isMatch) {
            const accessToken = await tokenGenerator.generateCenterToken(data, "30d", "student")
            return { message: "login success", accessToken }
        } else {
            throw new Error("Wrong password")
        }
    } catch (error: any) {
        throw new Error(error)
    }
}

const getAll = async (query: any): Promise<IStudent[]> => {
    try {
        const page = query.page || defaultValue.page
        const limit = query.limit || defaultValue.limit
        const skip = (page - 1) * limit
        const data = await Student.find()
            .populate("center", "firstName lastName email phone")
            .populate("classRoom")
            .populate('report')
            .select("-password")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec();
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}
const getStudenByCenter = async (centerId: string, query: any): Promise<IStudent[]> => {

    const page = query.page || defaultValue.page
    const limit = query.limit || defaultValue.limit
    const skip = (page - 1) * limit
    const classRoom = query.classroom
    const search = query.search
    const ignore = query.ignore
    try {
        const filters: any = {
            center: centerId,
        }
        if (classRoom) {
            filters["classRoom"] = classRoom
        }
        if (ignore) {
            filters["classRoom"] = {
                $nin: ignore
            }
        }
        if (search) {
            filters["$or"] = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ]
        }
        const data = await Student.find(filters)
            .populate("center", "firstName lastName email phone")
            .populate("classRoom")
            .populate('report')
            .skip(skip)
            .select("-password")
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec();
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const searchStudent = async (centerId: string, query: any): Promise<IStudent[]> => {
    const page = query.page || defaultValue.page
    const limit = query.limit || defaultValue.limit
    const skip = (page - 1) * limit
    const classRoom = query.classroom
    const search = query.search
    try {
        const filters: any = {
            center: centerId,

        }
        if (classRoom !== undefined && classRoom !== "" && classRoom) {
            filters["classRoom"] = classRoom
        }
        let data
        if (query.wc === "true") {
            data = await Student.find({
                ...filters,
                contact_numbers: { $exists: false },
                $or: [
                    { firstName: { $regex: search, $options: "i" } },
                    { lastName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ]
            })
                .populate("center", "firstName lastName email phone")
                .populate("classRoom")
                .populate('report')
                .skip(skip)
                .select("-password")
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
        }
        else {
            data = await Student.find({
                ...filters,

                $or: [
                    { firstName: { $regex: search, $options: "i" } },
                    { lastName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],

            })
                .populate("center", "firstName lastName email phone")
                .populate("classRoom")
                .populate('report')
                .skip(skip)
                .select("-password")
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
        }

        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const transferStudent = async (id: string, classRoom: string) => {
    try {
        const data = await Student.findByIdAndUpdate(id, {
            classRoom: classRoom
        }, { new: true })
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const getStudentByClass = async (query: any): Promise<any> => {
    try {
        const classRoom = query.class
        const center = query.center
        const page = query.page || defaultValue.page
        const limit = query.limit || defaultValue.limit
        const skip = (page - 1) * limit
        const data = await Student.find({
            classRoom: classRoom,
            center: center
        })
            .populate("center", "firstName lastName email phone")
            .select("-password")
            .populate("classRoom")
            .populate('report')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec();

        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const getSingle = async (id: string): Promise<IStudent> => {
    try {
        const data = await Student.findById(id)
            .populate("center", "firstName lastName email phone")
            .populate("classRoom")
            .populate('report')
            .exec();
        if (!data) {
            throw new Error("User not found")
        }
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const upadteStudent = async (id: string, user: IStudent): Promise<IStudent> => {
    try {
        const data = await Student.findByIdAndUpdate(id, user, { new: true })
        if (!data) {
            throw new Error("User not found")
        }
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const deleteStudent = async (id: string) => {
    try {
        const data = await Student.findByIdAndDelete(id)
        if (!data) {
            throw new Error("User not found")
        }
        return {
            message: "Student deleted successfully"
        }
    } catch (error: any) {
        throw new Error(error)
    }
}

const checkIn = async (id: string, time: string) => {
    try {
        const data = await Student.findById(id)
        if (!data) {
            throw new Error("User not found")
        }
        await Report.findByIdAndUpdate(data.report, {
            status: status.present,
            start: time,
            checkedIn: true,
            present: true
        })
        await data.save()
        return {
            message: "Student checked in successfully"
        }
    } catch (error: any) {
        throw new Error(error)
    }
}
const checkOut = async (id: string, time: string) => {
    try {
        const data: any = await Student.findById(id)
            .populate('report')
        if (!data) {
            throw new Error("User not found")
        }
        await Report.findByIdAndUpdate(data.report?._id, {
            status: status.checkedOut,
            end: time,
            total: moment(time).diff(data?.report?.start, 'minutes')
        })
        await data.save()
        return {
            message: "Student checked out successfully"
        }
    } catch (error: any) {
        throw new Error(error)
    }
}
const absent = async (id: string, reason: string) => {
    try {
        const data = await Student.findById(id)
        if (!data) {
            throw new Error("User not found")
        }
        await Report.findByIdAndUpdate(data.report, {
            status: status.absent,
            reason: reason
        })
        await data.save()
        return {
            message: "Student checked out successfully"
        }
    } catch (error: any) {
        throw new Error(error)
    }
}
const statistics = async (centerId: string, date: Date) => {
    try {
        // Define the start and end of the specified day
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Midnight at the beginning of the day
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of the day

        const total = await Report.countDocuments({
            center: centerId,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        const present = await Report.countDocuments({
            center: centerId,
            present: true,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        const checkedIn = await Report.countDocuments({
            center: centerId,
            checkedIn: true,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        const absent = await Report.countDocuments({
            center: centerId,
            $or: [
                { status: status.absent },
                { status: status.scheduled }
            ],
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        const checkedOut = await Report.countDocuments({
            center: centerId,
            status: status.checkedOut,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        const pending = await Report.countDocuments({
            center: centerId,
            status: status.notAssigned,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        })
        return {
            total,
            checkedIn,
            present,
            absent,
            checkedOut,
            pending
        };
    } catch (error: any) {
        throw new Error(`Failed to fetch statistics for the day: ${error.message}`);
    }
};



type AttendanceDay = {
    day: Date;
    active: boolean;
    checked_in: number;
    total: number;
    absent: number;
    selected: boolean;
};

const attendance = async (center: string, type: string, year: number, month: number): Promise<AttendanceDay[]> => {
    const selectedDate = new Date(year, month, 1);
    const days: AttendanceDay[] = [];
    const currentDate = new Date();

    try {
        while (selectedDate.getMonth() === month) {
            const dateString = new Date(selectedDate)

            const startOfDay = new Date(dateString.setHours(0, 0, 0, 0));
            const endOfDay = new Date(dateString.setHours(23, 59, 59, 999));

            const [total, checkedIn, absent] = await Promise.all([
                Report.countDocuments({
                    center,
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                }),
                Report.countDocuments({
                    center,
                    checkedIn: true,
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                }),
                Report.countDocuments({
                    center,
                    $or: [{ status: status.absent }, { status: status.scheduled }],
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                })
            ]);

            const newDate: AttendanceDay = {
                day: new Date(startOfDay),
                active:
                    currentDate.getDate() === selectedDate.getDate() &&
                    currentDate.getMonth() === selectedDate.getMonth() &&
                    currentDate.getFullYear() === selectedDate.getFullYear(),
                checked_in: checkedIn,
                total: total,
                absent: absent,
                selected: false,
            };

            // Set selected based on type
            if (type === "daily" && selectedDate.getDate() + 1 === currentDate.getDate() + 1) {
                newDate.selected = true;
            } else if (type === "weekly" && moment(selectedDate).isoWeek() === moment().isoWeek()) {
                newDate.selected = true;
            } else if (type === "monthly") {
                newDate.selected = true;
            }

            days.push(newDate);

            // Move to the next day
            selectedDate.setDate(selectedDate.getDate() + 1);
        }

        return days;
    } catch (error: any) {
        throw new Error(`Failed to generate attendance data: ${error.message}`);
    }
};

const dbStatistics = async (center: string) => {
    try {
        const classRooms = await ClassRoom.countDocuments({ center: center });
        const students = await Student.countDocuments({ center: center });
        const staffs = await Staff.countDocuments({ center: center });
        const withcontact = await Student.countDocuments({ contact_numbers: { $exists: true }, center: center });
        const data = {
            classRooms,
            students,
            staffs,
            withcontact
        }
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}
const getCurrentUser = async(id: string) => {
    try {
        const data = await Student.findById(id)
        if (!data) {
            throw new Error("User not found")
        }
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}
const studenService = {
    getAll,
    getStudenByCenter,
    createNew,
    searchStudent,
    transferStudent,
    getStudentByClass,
    getSingle,
    upadteStudent,
    deleteStudent,
    checkIn,
    checkOut,
    absent,
    statistics,
    attandance: attendance,
    dbStatistics,
    login,
    getCurrentUser
}

export default studenService