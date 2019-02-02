import Joi from 'joi'
import { startChat } from '../schemas'
import { UserInputError } from 'apollo-server-express'
import { Chat, User } from '../models'

async function updateUsers(users, ref) {
  const promises =users.map(u => {
    u.chats = u.chats ? [...u.chats, ref] : [ref]
    return u.commit()
  })
  await Promise.all(promises);
}

export default {
  Mutation: {
    startChat: async (root, args, {req}, info) => {
      let {title, userIds} = args
      const {userId} = req.session
      await Joi.validate(args, startChat(userId), {abortEarly: false})
      const other_user = userIds.map(u => User.ref(u))
      const users=other_user.concat([ User.ref(userId)])
      await User.getAll(users)
      const valid_users = other_user.filter(f => f.loaded())
      if(valid_users.length !== userIds.length){
        throw new UserInputError('ID utente non trovato!')
      }
      const chat = await Chat.createAndSave({title, users})
      const chat_ref = Chat.ref(chat.id())
      await updateUsers(users, chat_ref)
      return chat
    }
  }
}
