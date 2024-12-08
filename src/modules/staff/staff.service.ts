import { Query } from "../../type/common";
import tokenGenerator from "../../util/generateToken";
import Staff, { IStaff } from "./staff.model";
import bcrypt from 'bcrypt'
const defaultValue = {
    limit: 20,
    page: 1
}

const createNew = async (user: IStaff): Promise<IStaff> => {
    try {

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash('123456', salt)
        user.profilePic = user.profilePic ? user.profilePic : '/default-profile.png'
        user.password = hashedPassword
        const newUser = new Staff(user)
        const data = await newUser.save()
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const getAll = async (query: any): Promise<IStaff[]> => {
    try {
        const page = query.page || defaultValue.page
        const limit = query.limit || defaultValue.limit
        const skip = (page - 1) * limit
        const data = await Staff.find()
            .populate("center", "firstName lastName email phone")

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
const getStudenByCenter = async (centerId: string, query: any): Promise<IStaff[]> => {

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
            filters["enrollment"] = {
                $elemMatch: { classroom: classRoom }
            }
        }
        if (ignore) {
            filters["enrollment"] = {
                $not: { $elemMatch: { classroom: ignore } }
            }
        }
        if (search) {
            filters["$or"] = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ]
        }
        const data = await Staff.find(filters)
            .populate("center", "firstName lastName email phone")
            .populate('enrollment.classroom')
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

const searchStudent = async (centerId: string, query: any): Promise<IStaff[]> => {
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
            data = await Staff.find({
                ...filters,
                contact_numbers: { $exists: false },
                $or: [
                    { firstName: { $regex: search, $options: "i" } },
                    { lastName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ]
            })
                .populate("center", "firstName lastName email phone")
                .populate('enrollment.classroom')
                .skip(skip)
                .select("-password")
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
        }
        else {
            data = await Staff.find({
                ...filters,

                $or: [
                    { firstName: { $regex: search, $options: "i" } },
                    { lastName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],

            })
                .populate("center", "firstName lastName email phone")

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
        const data = await Staff.findByIdAndUpdate(id, {
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
        const data = await Staff.find({
            classRoom: classRoom,
            center: center
        })
            .populate("center", "firstName lastName email phone")
            .select("-password")
            .populate('enrollment.classroom')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec();

        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const getSingle = async (id: string): Promise<IStaff> => {
    try {
        const data = await Staff.findById(id)
            .populate("center", "firstName lastName email phone")
            .populate('enrollment.classroom')
            .exec();
        if (!data) {
            throw new Error("User not found")
        }
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const upadteStudent = async (id: string, user: IStaff): Promise<IStaff> => {
    try {
        const data = await Staff.findByIdAndUpdate(
            id, user,
            { new: true }
        )
        if (!data) {
            throw new Error(id)
        }
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const deleteStudent = async (id: string) => {
    try {
        const data = await Staff.findByIdAndDelete(id)
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
const transper = async (id: string, room: string) => {
    try {
        const data = await Staff.findByIdAndUpdate(id, {
        }, { new: true })
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const login = async (body: { email: string, password: string }) => {
    try {
        const data = await Staff.findOne({ email: body.email })
        if (!data) {
            throw new Error("User not found")
        }
        const isMatch = await bcrypt.compare(body.password, data.password)
        if (isMatch) {
            const accessToken = await tokenGenerator.generateCenterToken(data, "30d", "staff")
            return { message: "login success", accessToken }
        } else {
            throw new Error("Wrong password")
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
    login
}

export default studenService