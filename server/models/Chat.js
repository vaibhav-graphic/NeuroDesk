import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    userId: {type: String, ref: 'User', require: true},
    userName: {type: String, require: true},
    name: {type: String, require: true},
    messages: [
        {
            isImage: {type: Boolean, required: true},
            isPublished: {type: Boolean, default: false},
            role: {type: String, required: true},
            content: {type: String, required: true},
            timestamps: {type: Number, required: true}
        }
    ]
},{timestamps: true}
);

const Chat = mongoose.model('Chat', ChatSchema);

export default Chat;