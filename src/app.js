import http from 'http'
import socketIO from 'socket.io';
import { env, mongo, port, ip } from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import api from './api'

const app = express(api)
const server = http.createServer(app)

const io = new socketIO(server);
io.on('connection', (socket) => {
  console.log("User Connected !!")
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
})

mongoose.connect(mongo.uri)

setImmediate(() => {
  server.listen(port, ip, () => {
    console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
  })
})

export default {app, io}
