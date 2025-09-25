import { Application, feathers } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'

const socket = io('https://f77d5aaf8e8e.ngrok-free.app', {
  transports: ['websocket'],
  forceNew: true,
})

const feathersClient: Application = feathers()

feathersClient.configure(socketio(socket))

feathersClient.hooks({
  error: async (context) => {
    return context
  },
})

export default feathersClient
