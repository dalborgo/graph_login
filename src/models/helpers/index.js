import util from 'util'

export function getFunctions () {
  const create = util.promisify(this.create.bind(this))
  const getById = util.promisify(this.getById.bind(this))
  const find = util.promisify(this.find.bind(this))
  const count = util.promisify(this.count.bind(this))
  const loadAll = util.promisify(this.loadAll.bind(this))
  this.createAndSave = async args => await create({...args})
  this.byId = async id => await getById(id)
  this.how_many = async (filter = {}, option = {}) => await count(filter, option)
  this.search = async (filter = {}, option = {}) => await find(filter, option)
  this.getAll = async instances => await loadAll(instances)
}