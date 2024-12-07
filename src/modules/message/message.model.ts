import mongoose from "mongoose";

const schema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Sender is required']
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Receiver is required']
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: [true, 'Chat is required']
    },
    message: {
        type: String,
    },
    image: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Upload'
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    reply: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Message',
    },
    seen: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

const Message = mongoose.model('Message', schema);
export type IMessage = typeof Message

export default Message