import Joi from 'joi'
import { signUp, signIn } from '../schemas'
import { attemptSignIn, signOut } from '../auth'
import { User } from '../models'

export default {
  Query: {
    me: (root, args, {req}, info) => {
      const {userId} = req.session
      return User.byId(userId)
    },
    users: (root, args, {req}, info) => {
      return User.search({})
    },
    user: (root, {id}, {req}, info) => {
      return User.byId(id)
    }
  },
  Mutation: {
    signUp: async (root, args, {req}, info) => {
      await Joi.validate(args, signUp, {abortEarly: false})
      await User.check_email(args.email)
      const user = await User.createAndSave(args)
      req.session.userId = user.id()
      return user
    },
    signIn: async (root, args, {req}, info) => {
      await Joi.validate(args, signIn, {abortEarly: false})

      const user = await attemptSignIn(args.email, args.password)

      req.session.userId = user.id()

      return user
    },
    signOut: (root, args, {req, res}, info) => {
      return signOut(req, res)
    }
  },
  User : {
    chats : async (user, args, context, info) =>{
      await user.expand('chats')
      return user.chats
    }
  }
}
