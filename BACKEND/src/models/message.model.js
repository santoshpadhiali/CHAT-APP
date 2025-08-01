import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: { // corrected from "reciverId"
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String
    },
    image: {
        type: String
    }
}, {
    timestamps: true
});

const Message = mongoose.model("Message", messageSchema); // Capitalize model name
export default Message;
