import { Application, feathers } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'

const socket = io('https://1c2269d4c3da.ngrok-free.app', {
  transports: ['websocket'],
  forceNew: true,
})

console.log('Connecting to socket:', 'http://localhost:3030')

const feathersClient: Application = feathers()

feathersClient.configure(socketio(socket))

feathersClient.hooks({
  error: async (context) => {
    return context
  },
})

export default feathersClient
