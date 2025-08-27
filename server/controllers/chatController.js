import Chat from "../models/Chat.js";

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatData = {
      userId,
      message: [],
      name: "New Chat",
      userName: req.user.name,
    };

    await Chat.create(chatData);
    res.status(200).json({ success: true, msg: "Chat Created" });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.body;

    await Chat.deleteOne({_id: chatId, userId});

    res.status(200).json({ success: true, msg: "Chat Deleted" });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};
