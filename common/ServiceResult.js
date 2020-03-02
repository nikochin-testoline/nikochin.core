class ServiceResult {
  constructor ({ success, message, result, validations, httpCode }) {
    this.success = result != null || success === true
    this.message = message
    this.result = result
    this.validations = validations
    this.httpCode = httpCode
  }
}

module.exports = ServiceResult
