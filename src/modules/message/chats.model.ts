import mongoose, { Schema, Document, Model } from 'mongoose';

interface OwnerOrUser {
  id: mongoose.Schema.Types.ObjectId;
  model: 'Staff' | 'Student' | 'Center';
}

export interface IChat extends Document {
  owner: OwnerOrUser;
  user: OwnerOrUser;
  message: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    owner: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      model: { type: String, required: true, enum: ['Staff', 'Student', 'Center'] },
    },
    user: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      model: { type: String, required: true, enum: ['Staff', 'Student', 'Center'] },
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
  }
);

const Chat: Model<IChat> = mongoose.model<IChat>('Chat', ChatSchema);

export default Chat