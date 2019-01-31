import util from "util"

export function getFunctions (Model) {
  const create = util.promisify(Model.create.bind(Model))
  const getById = util.promisify(Model.getById.bind(Model))
  const find = util.promisify(Model.find.bind(Model))
  const count = util.promisify(Model.count.bind(Model))
  Model.createAndSave = async args => await create({...args})
  Model.byId = async (id, load) => await getById(id, load)
  Model.how_many =  async filter => await count(filter)
  Model.search = async (filter = {}, option) => await find(filter, option)
}