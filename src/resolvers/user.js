import Joi from 'joi'
//import { UserInputError } from 'apollo-server-express'
import { signUp, signIn } from '../schemas'
import { attemptSignIn } from '../auth'
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
      await User.check_email(args.email)
      return User.createAndSave(args)
    },
    signIn: async (root, args, { req }, info) => {
      // TODO: projection
      await Joi.validate(args, signIn, { abortEarly: false })

      const user = await attemptSignIn(args.email, args.password)


      return user
    },
  }
}
