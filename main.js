require('./extensions')

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

      return app
    }
  }
}
