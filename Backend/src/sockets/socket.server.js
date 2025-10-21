const { Server } = require("socket.io");
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const { GenResponse, GenVector } = require('../services/ai.service')
const { createMemory, queryMemory } = require('../services/vector.services');
const MsgModel = require('../models/message.model');

function initSocketServer(httpserver) {
  const io = new Server(httpserver, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  })

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
    console.log(cookies);

    if (!cookies.token) {
      return next(new Error("Authentication Error"));
    }

    try {
      const decode = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findOne({
        _id: decode.id
      })
      socket.user = user
    } catch (err) {
      return next(new Error("UnAuthorized User"));
    }
    next()
  })
  
  io.on('connection', (socket) => {

    console.log('User Connected',socket.user._id);


    socket.on("ai-message", async (data) => {

      console.log(data);

    const [message, vector] = await Promise.all([
      MsgModel.create({
        chat: data.chat,
        user: socket.user._id,
        content: data.content,
        role: "user"
      }),
      GenVector(data.content)
    ]);

      await createMemory(
        vector,
        {
          user: socket.user._id,
          chat: data.chat,
          text: data.content
        },
        message._id
    );

    const [memory, chatHistory] = await Promise.all([
      queryMemory({
        queryVector: vector,
        limit:3,
        metadata:{ user: socket.user._id}
      }),
      MsgModel.find({
        chat: data.chat,
      }).sort({ createdAt: -1 }).limit(20).lean().then(res=>res.reverse())
    ])
      console.log(memory);

      const stm = chatHistory.map(item=>{
        return {
          role: item.role,
          parts: [{text: item.content}]
        }
      })

      const ltm = [
        {
          role: 'user',
          parts: [{text: `These are some previous messages from the chat use this to generate response ${memory.map(item=>item.metadata.text).join("\n")} `}]
        }
      ]
      console.log(stm);


      const res = await GenResponse([...ltm, ...stm]);

      console.log(res);

        socket.emit('ai-res', {
        content: res,
        chat: data.chat,
      })

      const [response, resVector] = await Promise.all([
        MsgModel.create({
          chat: data.chat,
          user: socket.user._id,
          content: res,
          role: "model"
        }),
        GenVector(res)
      ]);

      await createMemory(
        resVector,
         {
          user: socket.user._id,
          chat: data.chat,
          text: res
        },
        response._id
      );



    })


  })
}

module.exports = initSocketServer;