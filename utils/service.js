const path = require('path')
const _isFunc = require('lodash/isFunction')
const { getRoutesInDirectory } = require('./path')
const { apiResponse } = require('./response')

exports.loadAPI = async function ({ dirname, app, params }) {
  const paths = await getRoutesInDirectory(dirname)

  paths
    .forEach(p => {
      const dirPath = path.join(dirname, p)
      let validations = []
      let middlewares = []

      try {
        validations = require(dirPath + '/validations')
        validations = _isFunc(validations) ? validations(params) : validations
      } catch (error) {}

      try {
        middlewares = require(dirPath + '/middlewares')
        middlewares = _isFunc(middlewares) ? middlewares(params) : middlewares
      } catch (error) {}

      app.post('/api' + p, ...validations, ...middlewares, apiResponse(require(dirPath)(params)))
    })
}
