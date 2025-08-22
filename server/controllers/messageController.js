import Chat from "../models/Chat.js";
import User from "../models/User.js";

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamps: Date.now(),
      isImage: false,
    });

    const {choices} = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {...choices[0].message, timestamps: Date.now, isImage: false};
    res.json({success: true, reply});

    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({_id: userId}, {$inc: {credits: -1}});

  } catch (error) {
    res.json({success: false, msg: error.message});
  }
};
