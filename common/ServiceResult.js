class ServiceResult {
  constructor ({ success, message, result }) {
    this.success = result != null || success === true
    this.message = message
    this.result = result
  }
}

module.exports = ServiceResult
