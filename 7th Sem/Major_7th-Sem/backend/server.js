const express = require('express')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const colors = require('colors')
const path = require('path')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')

dotenv.config()
connectDB()

const app = express()
const __dirname1 = path.resolve()

// Middleware
app.use(express.json())
app.use(cors())

// API Routes
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

// Serve static files (React app) in production
app.use(express.static(path.join(__dirname1, '/frontend/build')))

app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'))
)

// Error handling middlewares
app.use(notFound)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`.yellow.bold)
})

// Socket.io setup
const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
  },
})

io.on('connection', (socket) => {
  console.log('connected to socket.io')

  socket.on('setup', (userData) => {
    socket.join(userData._id)
    socket.emit('connected')
  })

  socket.on('chat connect', (room) => {
    socket.join(room)
    console.log('chatId : ' + room)
  })

  socket.on('typing', (room) => socket.in(room).emit('typing'))
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

  socket.on('New Message', (NewMessageReceived) => {
    var chat = NewMessageReceived.chat
    if (!chat.users) return console.log('users of this chat are undefined')

    chat.users.forEach((user) => {
      if (user._id == NewMessageReceived.sender._id) return
      socket.in(user._id).emit('message received', NewMessageReceived)
    })
  })

  socket.off('setup', () => {
    socket.leave(userData._id)
  })
})
