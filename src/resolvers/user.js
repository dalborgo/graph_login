import Joi from 'joi'
//import { UserInputError } from 'apollo-server-express'
import { signUp } from '../schemas'
import { User } from '../models'

export default {
  Query: {
    users: () => {
      // TODO: auth, projection, pagination

      return new Promise((resolve, reject) => {
        User.find({}, function (err, users) {
          if (err) {
            reject(err)
          }
          resolve(users)
        })
      })
    },
    user: (root, { id }, context, info) => {
      // TODO: auth, projection, sanitization

      /* if (!mongoose.Types.ObjectId.isValid(id)) {
         throw new UserInputError(`${id} is not a valid user ID.`)
       }*/

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
    signUp: async (root, args, context, info) => {
      // TODO: not auth, validation

      await Joi.validate(args, signUp, { abortEarly: false })
      return new Promise((resolve, reject) => {
        User.createAndSave(
          args.username,
          args.email,
          args.name,
          args.password,
          (err, user) => {
            if (err) {
              reject(err)
            } else {
              resolve(user)
            }
          })
      })
    }
  }
}
