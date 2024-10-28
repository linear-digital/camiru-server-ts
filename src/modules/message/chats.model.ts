import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        userType: {
            type: String,
            enum: ['admin', 'center', 'staff', 'student'],
        },
        required: [true, 'User 1 is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        userType: {
            type: String,
            enum: ['admin', 'center', 'staff', 'student'],
        },
        required: [true, 'User 2 is required']
    },
    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },

},
 {
    timestamps: true
})

const Chat = mongoose.model('Chat', chatSchema);

export default Chat