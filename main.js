require('./extensions')

const expressJoi = require('express-joi-validator')
const ServiceResult = require('./common/ServiceResult')
const joiErrorFormat = require('./libs/joi_error_format')

module.exports = function (app) {
  const stack = []
  return {
    use (service) {
      stack.push(service)
      return this
    },
    async build () {
      const last = stack.pop()
      const ps = []

      for (var i = 0; i < stack.length; i++) {
        ps.push(stack[i](app))
      }

      await Promise.all(ps)
      await last(app)

      if (expressJoi) {
        app.use(function (err, req, res, next) {
          if (err.isBoom) {
            const validations = joiErrorFormat(err)

            return res.status(400).json(new ServiceResult({ validations }))
          }
        })
      }

      return app
    },
  }
}
