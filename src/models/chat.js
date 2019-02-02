import {getFunctions} from './helpers'
import {
  ottoman
} from '../db'
import { hashSync } from 'bcryptjs'
import User from './user'

const Chat = ottoman.model('Chat', {
  title: 'string',
  users: [{ref: 'User'}],
  lastMessage: {ref: 'Message'},
  createdAt: {type: 'Date', default: Date.now},
  updateAt: 'Date'
})
getFunctions.call(Chat)

Chat.pre('save', function (chat, next) {
  this.updateAt = new Date()
  next()
})

export default Chat

