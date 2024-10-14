import { stat } from "fs";
import mongoose from "mongoose";
import { start } from "repl";

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Guardian FirstName is required"],
    },
    lastName: {
        type: String,
        required: [true, "Guardian LastName is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    home: {
        type: String,
        required: [true, "Number is required"],
    },
    others: {
        type: String,
    },
    guardianType: {
        type: String,
        required: [true, "Guardian Type is required"],
    }
});

const childSchema = new mongoose.Schema({
    center: { // Owner of Center Admin
        type: mongoose.Schema.Types.ObjectId,
        ref: "Center",
        required: [true, "Canter id is required"],
    },
    classRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassRooms",
        required: [true, "Class Room is required"],
    },
    firstName: {
        type: String,
        required: [true, "First Name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
    },
    adress: {
        type: String,
        required: [true, "Adress is required"],
    },
    dob: {
        type: Date,
        required: [true, "Date of Birth is required"],
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
    },
    profilePic: {
        type: String,
        required: [true, "Profile Picture is required"],
    },
    education: [
        {
            university: {
                type: String,
                required: [true, "University is required"],
            },
            degree: {
                type: String,
                required: [true, "Degree is required"],
            },
            start: {
                type: Date,
                required: [true, "Start date is required"],
            },
            end: {
                type: Date,
                required: [true, "End date is required"],
            },
            cgpa: {
                type: Number,
                required: [true, "CGPA is required"],
            }
        }
    ],
    enrollment: [
        {
            class: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ClassRooms",
                required: [true, "Class Room is required"],
            },
            start: {
                type: Date,
                required: [true, "Start date is required"],
            },
            shifting: {
                type: String,
                required: [true, "Shifting is required"],
            },
            status: {
                type: String,
                required: [true, "Status is required"],
            },
            schedule: {
                type: Array,
                required: [true, "Schedule is required"],
            }
        },
    ],
    record: [
        {
            title: {
                type: String,
                required: [true, "Title is required"],
            },
            file: {
                type: String,
                ref: "Upload",
                required: [true, "File is required"],
            }
        }
    ],
    notes: {
        type: Array,
        default: [],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    }
}, {
    timestamps: true
});

const Student = mongoose.model("Student", childSchema);
export type IStudent = mongoose.InferSchemaType<typeof childSchema>;

export default Student
