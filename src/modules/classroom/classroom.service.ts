import ClassRoom, { IClassRoom } from "./classroom.model"

const createNew = async (body: IClassRoom): Promise<IClassRoom> => {
    try {
        const newData = new ClassRoom(body)
        const data = await newData.save()
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const getAll = async (): Promise<IClassRoom[]> => {
    try {
        const data = await ClassRoom.find()
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const getClassesByCanter = async (canter: string): Promise<any> => {
    try {
        const data = await ClassRoom.find({ center: canter })
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}

const getSingle = async (id: string): Promise<IClassRoom> => {
    try {
        const data = await ClassRoom.findById(id)
        if (!data) {
            throw new Error("User not found")
        }
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}
const updateClass = async (id: string, body: IClassRoom): Promise<IClassRoom> => {
    try {
        const data = await ClassRoom.findByIdAndUpdate(id, body, { new: true })
        if (!data) {
            throw new Error("User not found")
        }
        return data
    } catch (error: any) {
        throw new Error(error)
    }
}
const deleteAData = async (id: string) => {
    try {
        const data = await ClassRoom.findByIdAndDelete(id)
        if (!data) {
            throw new Error("User not found")
        }
        return {
            message : "Class deleted successfully"
        }
    } catch (error: any) {
        throw new Error(error)
    }
} 

const classService = {
    createNew,
    getAll,
    getClassesByCanter,
    getSingle,
    updateClass,
    deleteAData
}

export default classService