import Chat from "../models/Chat.js";
import { ai } from "../config/openai.js";
import User from "../models/User.js";
import axios from "axios";
import imagekit from "../config/imageKit.js";

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }

    const { chatId, prompt } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, error: "Chat not found" });
    }

    if (String(chat.userId) !== String(userId)) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    // User message
    chat.messages.push({
      role: "user",
      content: prompt,
      timeStamp: Date.now(),
      isImage: false,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const aiReply = response.text;

    // Assistant message
    const assistantMessage = {
      role: "assistant",
      content: aiReply,
      timeStamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(assistantMessage);

    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    res.status(200).json({
      success: true,
      reply: assistantMessage,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: "AI response failed",
      details: error.message,
    });
  }
};

//Image generation message controller
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    //Check credits
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }
    const { prompt, chatId, isPublished } = req.body;
    //Find Chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    if (String(chat.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (typeof isPublished === "boolean") {
      chat.isPublished = isPublished;
    }
    //push user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timeStamp: Date.now(),
      isImage: false,
    });

    //Encode the prompt
    const encodedPompt = encodeURIComponent(prompt);

    //contruct imagekit ai generation url
    const generatedImageUrl = `${
      process.env.IMAGEKIT_URL_ENDPOINT
    }/ik-genimg-prompt--${encodedPompt}/SharkiAi/${Date.now()}.png?tr=w-800,h-800`;

    //Trigger generation by fetching from imagekit
    const aiImageReponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    //Convert to base64
    const base64Image = `data:/image/png;base64,${Buffer.from(
      aiImageReponse.data,
      "binary"
    ).toString("base64")}`;

    //Upload to imageKit media Library
    const uploadReponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "SharkiAi",
    });

    const reply = {
      role: "assistant",
      content: uploadReponse.url,
      timeStamp: Date.now(),
      isImage: true,
      isPublished: Boolean(isPublished),
    };

    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    res.json({ success: true, reply });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
