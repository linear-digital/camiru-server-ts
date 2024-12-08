
import mongoose from "mongoose";


const childSchema = new mongoose.Schema({
    center: { // Owner of Center Admin
        type: mongoose.Schema.Types.ObjectId,
        ref: "Center",
        required: [true, "Canter id is required"],
    },
    role: {
        type: String,
        default: "staff",
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
    address: {
        type: String,
        required: [true, "Adress is required"],
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    zip: {
        type: String,
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
        default: '/default-profile.png'
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
            startDate: {
                type: Date,
                required: [true, "Start date is required"],
            },
            endDate: {
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
            classroom: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ClassRooms",
                required: [true, "Class Room is required"],
            },
            startDate: {
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
    records: [
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
        },
    ],
    notes: {
        type: Array,
        default: [],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    active: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Staff = mongoose.model("Staff", childSchema);
export type IStaff = mongoose.InferSchemaType<typeof childSchema>;

export default Staff
