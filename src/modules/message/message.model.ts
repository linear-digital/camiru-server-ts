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
    text: {
        type: String,
    },
    image: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Upload',
        default: []
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    reply: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Message',
        default: []
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