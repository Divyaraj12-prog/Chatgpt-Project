const jwt = require('jsonwebtoken');
const ChatModel = require('../models/chat.model');
const MsgModel = require('../models/message.model'); // added

async function chatController(req,res) {
  // defensive extraction of title (accept string or nested object)
  const rawTitle = req.body?.title;
  const title = typeof rawTitle === 'string'
    ? rawTitle
    : (rawTitle && typeof rawTitle === 'object' && typeof rawTitle.title === 'string')
      ? rawTitle.title
      : 'New Chat';

  // optional: log for easier debugging in dev
  console.log('create chat payload title:', rawTitle, '-> using title:', title);

  const chat = await ChatModel.create({
    title,
    user: req.user._id
  });

  return res.status(201).json({ chat });
}

async function getChatsController(req,res) {
  try {
    const user = req.user;

    // return lean() so we can map fields safely and avoid mongoose docs on client
    const chats = await ChatModel.find({ user: user._id }).sort({ updatedAt: -1 }).lean();

    return res.status(200).json({
      message: "Chats fetched successfully",
      chats: chats.map(chat => ({
        // return canonical server id field expected by frontend
        _id: chat._id,
        title: chat.title,
        lastactivity: chat.lastactivity,
        user: chat.user,
        // include an explicit messages array (empty if not stored on chat)
        messages: Array.isArray(chat.messages) ? chat.messages : []
      }))
    });
  } catch (err) {
    console.error('getChatsController error:', err);
    return res.status(500).json({ message: 'Failed to fetch chats', error: err.message });
  }
}

// new: return messages for a chat
async function getMessagesController(req, res) {
  try {
    const user = req.user;
    const chatId = req.params.chatId;

    // validate id
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: 'Invalid chat id' });
    }

    // ensure chat belongs to user (optional, safer)
    const chat = await ChatModel.findOne({ _id: chatId, user: user._id }).lean();
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // fetch messages for chat, sorted ascending
    const messages = await MsgModel.find({ chat: chatId }).sort({ createdAt: 1 }).lean();

    return res.status(200).json({ messages });
  } catch (err) {
    console.error('getMessagesController error:', err);
    return res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
}

module.exports = {
  chatController,
  getChatsController,
  getMessagesController
}