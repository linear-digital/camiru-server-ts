import mongoose from "mongoose";
import { statusArray } from "./status";

const schema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    center: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Center',
        required: [true, 'Center is required']
    },
    classRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassRooms',
        required: [true, 'Class Room is required']
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
    },
    start: {
        type: Date,
    },
    end: {
        type: Date,
    },
    total: {
        type: Number
    },
    reason: {
        type: String,
    },
    checkedIn: {
        type: Boolean,
        default: false
    },
    present: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: statusArray,
        default: statusArray[0]
    }
}, {
    timestamps: true
});

const Report = mongoose.model('Report', schema);
export default Report