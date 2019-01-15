import bcrypt from 'bcryptjs'
import util from 'util'
const {
  ottoman,
  bucket,
} = require('../db')
const _throw = m => {throw m}
const User = ottoman.model('User', {
  username: {type: 'string', readonly: true},
  email: 'string',
  name: 'string',
  password: 'string',
  createdAt: {type: 'Date', default: Date.now},
}, {id: 'username'})

User.pre('save', function (user, next) {
  this.password = bcrypt.hashSync(this.password, 10)
  next()
})
const create = util.promisify(User.create.bind(User))
const count = util.promisify(User.count.bind(User))
User.check_email = async email => await count({ email }) && _throw('Duplicated: ' + email)

User.createAndSave = async args => await create({...args})

ottoman.ensureIndices(function (err) {
  if (err) {
    return console.error('Error ensure indices Places', err)
  }
  console.log('Ensure indices Places')
})

export default User

