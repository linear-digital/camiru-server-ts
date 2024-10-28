import mongoose from "mongoose";

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
        required: [true, "Center is required"],
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
    studentId: {
        type: Number,
        required: [true, "Student Id is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    profilePic: {
        type: String,
        default: '/default-profile.png'
    },
    gender: {
        type: String,
        enum: ["boy", "gril", "x"],
        required: [true, "Gender is required"],
    },
    status: {
        type: String,
        enum: ["active", "inactive"], // Example enum values, adjust as needed
        required: [true, "Status is required"],
    },
    rotation: {
        type: String,
        enum: ["morning", "afternoon", "evening"], // Example enum values, adjust as needed
        required: [true, "Rotation is required"],
    },
    days: {
        type: [String], // Specify that days should be an array of strings
        required: [true, "Days is required"],
    },
    contacts: [contactSchema], // Use the contactSchema for validation
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    country: {
        type: String,
        default: 'USA', // Example default value, adjust as needed
    },
    city: {
        type: String,
        required: [true, "City is required"],
    },
    state: {
        type: String,
    },
    zip: {
        type: String,
        required: [true, "Zip is required"],
    },
    records: {
        type: Array, // Specify that records should be an array of strings or any other data type
        default: [],
    },
    notes: {
        type: Array, // Specify that records should be an array of strings or any other data type
        default: [],
    },
    isPermitted: {
        type: Boolean,
        default: false,
    },
    birthDate: {
        type: Date,
        required: [true, "Birth Date is required"],
    },
    enrollmentDate: {
        type: Date,
        required: [true, "Enrollment Date is required"],
    },
    graduate: {
        type: Boolean,
        default: false,
    },
    graduationDate: {
        type: Date,
    },
    report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
    }
}, {
    timestamps: true
});

const Student = mongoose.model("Student", childSchema);
export type IStudent = mongoose.InferSchemaType<typeof childSchema>;

export default Student
