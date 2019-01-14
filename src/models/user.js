import bcrypt from 'bcryptjs'

const couchbase = require('couchbase')
const {
  ottoman,
  bucket,
} = require('../db')

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

User.createAndSave = function (username, email, name, password, done) {
  this.create({
    username,
    email,
    name,
    password
  }, done)
}

ottoman.ensureIndices(function (err) {
  if (err) {
    return console.error('Error ensure indices Places', err)
  }
  console.log('Ensure indices Places')
})

export default User

