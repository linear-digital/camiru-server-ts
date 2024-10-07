import { CenterType } from "../../type/user";
import tokenGenerator from "../../util/generateToken";
import Center, { Icenter } from "./center.model";
import bcrypt from 'bcrypt'

// create new
const createNew = async (body: Icenter): Promise<Icenter> => {
    try {

        const password = body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        body.password = hashedPassword

        const newData = new Center(body)
        const data = await newData.save()
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

// login

const login = async (body: { email: string, password: string }) => {
    try {

        const data = await Center.findOne({ email: body.email })
        if (!data) {
            throw new Error("User not found")
        }
        if (data) {
            const isMatch = await bcrypt.compare(body.password, data.password)
            if (isMatch) {
                const session = await tokenGenerator.generateCenterToken(data, "30d", "center")

                const accessToken = await tokenGenerator.generateCenterToken(data, "1h", session)

                return { message: "login success", accessToken }
            } else {
                throw new Error("Wrong password")
            }
        } else {

            throw new Error("User not found")
        }
    } catch (error: any) {
        throw new Error(error)
    }
}

// get all data 

const getAll = async (limit: number, skip: number): Promise<Icenter[]> => {

    try {
        const data = await Center.find()
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

// get Single
const getSingle = async (id: string): Promise<Icenter> => {
    try {
        const data = await Center.findById(id)
            .select("-password")
            .exec();
        if (!data) {
            throw new Error("User not found")
        }
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}
const search = async (text: string): Promise<Icenter | null> => {
    try {
        const data = await Center.findOne({
            $or: [
                { firstName: { $regex: text, $options: "i" } },
                { email: { $regex: text, $options: "i" } },
                { phone: { $regex: text, $options: "i" } },
            ]
        })
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const update = async (id: string, body: CenterType) => {

    try {
        const data = await Center.findByIdAndUpdate(id, body, { new: true })
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const updatePassword = async (id: string, body: { current: string, password: string }): Promise<{ message: string }> => {
    try {

        const { current, password } = body

        const user = await Center.findById(id)
        if (!user) {
            throw new Error("User not found")
        }
        const isMatch = await bcrypt.compare(current, user.password)
        if (!isMatch) {
            throw new Error("Wrong password")
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        await Center.findByIdAndUpdate(id, { password: hashedPassword })

        return { message: "Password updated successfully" }
    } catch (error: any) {
        throw new Error(error)
    }
}


const centerService = {
    createNew,
    login,
    getAll,
    getSingle,
    search,
    update,
    updatePassword
}
export default centerService
