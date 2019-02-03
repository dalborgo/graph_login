import {getFunctions} from './helpers'
import {
  ottoman
} from '../db'
import { hashSync } from 'bcryptjs'
import User from './user'
import util from "util"

const Chat = ottoman.model('Chat', {
  title: 'string',
  users: [{ref: 'User'}],
  lastMessage: {ref: 'Message'},
  createdAt: {type: 'Date', default: Date.now},
  updateAt: 'Date'
})
getFunctions.call(Chat)
const USER_LIMIT = 5
Chat.pre('save', async function (chat, next) {
  if(!this.title){
    const usersForTitle = this.users.slice(0,USER_LIMIT)
    await User.getAll(usersForTitle)
    let title = usersForTitle.map(u => u.name).join(', ')
    if(this.users.length > USER_LIMIT){
      title += '...'
    }
    this.title = title
  }
  this.updateAt = new Date()
  next()
})

Chat.prototype.expand = async function (path) {
  const load = util.promisify(this.load.bind(this))
  await load(path)
}

export default Chat

