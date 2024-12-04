import mongoose from "mongoose";

const centerSchema = new mongoose.Schema({
    role: {
        type: String,
        default: "center"
    },
    firstName: {
        type: String,
        required: [true, "First name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    profilePic: {
        type: String,
        default: "/default-profile.png"
    },
    timeZone: {
        type: String
    },
    media_sharing_delay: {
        type: Number,
        default: 0
    },
    autoReportSend: {
        type: Number,
        default: 0
    },
    tax_id: {
        type: String,
        required: [true, "Tax ID is required"]
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    country: {
        type: String,
        required: [true, "Country is required"]
    },
    city: {
        type: String,
        required: [true, "City is required"]
    },
    state: {
        type: String,
        required: [true, "State is required"]
    },
    zip: {
        type: String,
        required: [true, "ZIP code is required"]
    },
    parent_signin_identification: {
        type: Number,
        default: 3
    },
    child_name_display: {
        type: Number,
        default: 2
    },
    parent_signin: {
        type: Boolean,
        default: false
    },
    safePickup: {
        type: Boolean,
        default: false
    },
    classroom_access: {
        type: Boolean,
        default: false
    },
    teacher_editable_timecard: {
        type: Boolean,
        default: false
    },
    full_week_center: {
        type: Boolean,
        default: false
    },
    dob: {
        type: Date
    },
    pob: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

const Center = mongoose.model("Center", centerSchema);
export type Icenter = mongoose.InferSchemaType<typeof centerSchema>;

export default Center