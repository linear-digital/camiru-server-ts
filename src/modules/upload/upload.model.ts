import mongoose from "mongoose";


const uploadSchema = new mongoose.Schema({
    file: {
        type: Object,
        required: true
    },
    type: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

const Upload = mongoose.model("Upload", uploadSchema);
export type IUplaod = mongoose.InferSchemaType<typeof uploadSchema>;
export default Upload