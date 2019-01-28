import { hashSync, compare } from 'bcryptjs'
import util from 'util'
import {
  ottoman
} from '../db'
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
const create = util.promisify(User.create.bind(User))
const count = util.promisify(User.count.bind(User))
const getById = util.promisify(User.getById.bind(User))
const find = util.promisify(User.find.bind(User))
User.check_email = async email => await count({ email }) && _throw('Duplicated: ' + email)
User.createAndSave = async args => await create({...args})
User.byId = async id => await getById(id)
User.search = async filter => await find(filter)
User.prototype.matchesPassword = function (password) {
  return compare(password, this.password)
}

ottoman.ensureIndices(function (err) {
  if (err) {
    return console.error('Error ensure indices Places', err)
  }
  console.log('Ensure indices Places')
})

export default User

