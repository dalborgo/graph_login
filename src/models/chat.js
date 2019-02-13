import { getFunctions } from './helpers'
import {
  ottoman
} from '../db'
import { hashSync } from 'bcryptjs'
import User from './user'
import util from 'util'

const Chat = ottoman.model('Chat', {
  title: 'string',
  users: [{ ref: 'User' }],
  lastMessage: { ref: 'Message' },
  createdAt: { type: 'Date', default: Date.now },
  updateAt: 'Date'
}, {
  queries: {
    myMessages: {
      type: 'n1ql',
      of: 'Message',
      by: 'chat'
    }
  }
})
getFunctions.call(Chat)
const USER_LIMIT = 5
Chat.pre('save', async function (chat, next) {
  if (!this.title) {
    const users = await User.search({ username: { $in: this.users } }, { limit: USER_LIMIT })
    let title = users.map(u => u.name).join(', ')
    if (this.users.length > USER_LIMIT) {
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
Chat.prototype.getMessages = async function () {
  const getMessages = util.promisify(this.myMessages.bind(this))
  return await getMessages()
}

export default Chat

