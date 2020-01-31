const mongoose = require('mongoose')
const _isArray = require('lodash/isArray')

function SchemaPlugin (schema, options) {
  schema.statics.findPage = function (query, page, size, sort) {
    return this.find(query).sort(sort).skip(page * size).limit(size)
  }

  schema.statics.getPage = async function (query, page = 0, size = 15, sort, mapping, populate) {
    size = Math.min(size, 25)

    const find = _isArray(query) ? this.find(...query) : this.find(query)

    var action = find.sort(sort).skip(page * size).limit(size)

    if (populate) {
      action = populate(action)
    }

    const list = await action.exec()

    const count = await this.countDocuments(query)
    const totalItem = count
    const totalPage = Math.ceil(totalItem / size)
    const items = mapping ? list.map(mapping).filter(i => i != null) : list

    return {
      totalItem,
      totalPage,
      items,
    }
  }

  schema.statics.getById = function (...params) {
    return this.findById(...params).exec()
  }

  schema.statics.getOne = function (...params) {
    return this.findOne(...params).exec()
  }

  schema.statics.get = function (...params) {
    return this.get(...params).exec()
  }

  schema.statics.idExist = function (id) {
    return this.findById(id, '_id').exec().then(found => found != null)
  }

  schema.statics.checkExist = function (query) {
    return this.findOne(query, '_id').exec().then(found => found != null)
  }

  schema.statics.updateEntity = function (entity) {
    return this.findByIdAndUpdate(entity._id, entity).exec()
  }
}

mongoose.plugin(SchemaPlugin)
