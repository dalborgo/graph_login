import { hashSync, compare } from 'bcryptjs'
import {
  ottoman
} from '../db'
import { getFunctions } from './helpers'
const _throw = m => {throw m}
const User = ottoman.model('User', {
  username: {type: 'string', readonly: true},
  email: 'string',
  name: 'string',
  password: 'string',
  createdAt: {type: 'Date', default: Date.now},
}, {id: 'username'})

User.pre('save', function (user, next) {
  this.password = hashSync(this.password, 10)
  next()
})
console.log('eccolo')
getFunctions(User)
User.check_email = async email => await User.how_many({ email }) && _throw('Duplicated: ' + email)

User.prototype.matchesPassword = function (password) {
  return compare(password, this.password)
}

/*ottoman.ensureIndices(function (err) {
  if (err) {
    return console.error('Error ensure indices Places', err)
  }
  console.log('Ensure indices Places')
})*/

export default User

