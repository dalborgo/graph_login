import { getFunctions } from './helpers'
import {
  ottoman
} from '../db'
import Chat from './chat'

const Message = ottoman.model('Message', {
  body: 'string',
  sender: {ref: 'User'},
  chat: {ref: 'Chat'},
  createdAt: {type: 'Date', default: Date.now},
  updateAt: 'Date'
})
getFunctions.call(Message)

Message.pre('save', function (message, next) {
  this.updateAt = new Date()
  next()
})

export default Message

