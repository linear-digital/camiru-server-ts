import { Query } from "../../type/common";
import Student, { IStudent } from "./student.model";
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
        user.password = studentId.toString()
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
            message : "Student deleted successfully"
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
    deleteStudent
}

export default studenService