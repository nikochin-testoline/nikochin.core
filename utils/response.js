function response (callback) {
  return async function (req, res) {
    try {
      const result = await callback(req.body, req)

      delete result.success
      res.json(result)
    } catch (error) {
      const env = process.env.NODE_ENV || 'dev'

      if (env == 'dev') console.error('[Response Error]:', error)

      delete error.success
      delete error.httpCode

      res.status(error.httpCode || 500).json(error)
    }
  }
}

function nodeResponse (serviceBuilder, actionName) {
  return response((body, req) => serviceBuilder(req.node)[actionName](body, req))
}

function serviceResponse (service, actionName) {
  return response((body, req) => service[actionName](body, req))
}

function apiResponse (api) {
  return response((body, req) => api(body, req))
}

exports.response = response
exports.nodeResponse = nodeResponse
exports.serviceResponse = serviceResponse
exports.apiResponse = apiResponse
