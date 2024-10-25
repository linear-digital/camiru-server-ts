import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
    },
    message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },

}, {
    timestamps: true
})

const Chat = mongoose.model('Chat', chatSchema);

export default Chat