import {getFunctions} from './helpers'
import {
  ottoman
} from '../db'

const Chat = ottoman.model('Chat', {
  user: {ref: 'User'},
  createdAt: {type: 'Date', default: Date.now},
})

getFunctions(Chat)

export default Chat

