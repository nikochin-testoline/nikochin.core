class ServiceResult {
  constructor ({ success, message, result, validations }) {
    this.success = result != null || success === true
    this.message = message
    this.result = result
    this.validations = validations
  }
}

module.exports = ServiceResult
