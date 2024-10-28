import moment from "moment";
import { Query } from "../../type/common";
import Report from "../report/reports.model";
import { status } from "../report/status";
import Student, { IStudent } from "./student.model";
import bcrypt from 'bcrypt'
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
    absent
}

export default studenService