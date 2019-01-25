import { AuthenticationError } from 'apollo-server-express'
import { User } from './models'
import util from 'util'
const find = util.promisify(User.find.bind(User))
export const attemptSignIn = async (email, password) => {
  const message = 'Incorrect email or password. Please try again.'
  const user = (await find({ email }))[0]
  if (!user || !await user.matchesPassword(password)) {
    throw new AuthenticationError(message)
  }
  return user
}
