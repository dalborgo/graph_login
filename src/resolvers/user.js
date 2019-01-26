import Joi from 'joi'
//import { UserInputError } from 'apollo-server-express'
import { signUp, signIn } from '../schemas'
import { attemptSignIn, signOut, ensureSignedIn, ensureSignedOut } from '../auth'
import { User } from '../models'

export default {
  Query: {
    me: (root, args, {req}, info) => {
      ensureSignedIn(req)
      return User.findById(req.session.userId)
    },
    users: (root, args, {req}, info) => {
      ensureSignedIn(req)
      return new Promise((resolve, reject) => {
        User.find({}, function (err, users) {
          if (err) {
            reject(err)
          }
          resolve(users)
        })
      })
    },
    user: (root, {id}, {req}, info) => {
      ensureSignedIn(req)
      return new Promise((resolve, reject) => {
        User.getById(id, function (err, user) {
          if (err) {
            reject(err)
          } else {
            resolve(user)
          }
        })
      })
    }
  },
  Mutation: {
    signUp: async (root, args, {req}, info) => {
      ensureSignedOut(req)
      await Joi.validate(args, signUp, {abortEarly: false})
      await User.check_email(args.email)
      const user = User.createAndSave(args)
      req.session.userId = user.id
      return user
    },
    signIn: async (root, args, {req}, info) => {
      const {userId} = req.session
      if (userId) {
        return new Promise((resolve, reject) => {
          User.getById(userId, function (err, user) {
            if (err) {
              reject(err)
            } else {
              resolve(user)
            }
          })
        })
      }
      await Joi.validate(args, signIn, {abortEarly: false})

      const user = await attemptSignIn(args.email, args.password)
      req.session.userId = user.id

      return user
    },
    signOut: (root, args, {req, res}, info) => {
      return signOut(req, res)
    }
  }
}
