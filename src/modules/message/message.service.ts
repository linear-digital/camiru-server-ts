import Chat from "./chats.model";
import Message, { IMessage } from "./message.model";

const createMessage = async (data: IMessage) => {
    try {
        const newMessage = new Message(data)
        const result = await newMessage.save()

        const message = await Message.findById(result._id)
            .populate('image')

        return message

    } catch (error: any) {
        throw new Error(error)
    }
}
const createNewChat = async (user1: string, user2: string) => {
    try {
        let chat;
        const [check, check2] = await Promise.all([
            Chat.findOne({ user: user1, owner: user2 }),
            Chat.findOne({ user: user2, owner: user1 })
        ]);

        if (!check) {
            await Chat.create({ user: user1, owner: user2 });
        }

        if (!check2) {
            chat = await Chat.create({ user: user2, owner: user1 });
        }

        return chat || check2
    } catch (error: any) {
        throw new Error(error)
    }
}


const messageService = {
    createMessage,
    createNewChat
}

export default messageService