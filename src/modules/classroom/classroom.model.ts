import mongoose from "mongoose";

const classRoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    center: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Center",
        required: true
    }
},
    {
        timestamps: true
    }

);
const ClassRoom = mongoose.model("ClassRooms", classRoomSchema);
export type IClassRoom = mongoose.InferSchemaType<typeof classRoomSchema>;

export default ClassRoom

