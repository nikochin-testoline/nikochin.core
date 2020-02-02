module.exports = function (error) {
  return error.data.map(i => new ErrorItem(i).data)
}

class ErrorItem {
  constructor (error) {
    this.e = error
  }

  get data () {
    switch (this.e.type) {
      case 'any.required':
        return this.required()
      case 'string.min':
        return this.stringMin()
      case 'string.max':
        return this.stringMax()
      case 'string.regex.base':
        return this.stringRegex()
      default:
        console.error(this.e)
        return {
          name: this.fieldName,
          type: this.e.type,
        }
    }
  }

  get baseData () {
    return {
      name: this.fieldName,
      message: this.message,
    }
  }

  get fieldName () {
    return this.e.path.replace('body.', '').replace('query.', '').replace('params.', '')
  }

  required () {
    return {
      ...this.baseData,
      type: 'required',
    }
  }

  stringMin () {
    return {
      ...this.baseData,
      type: 'string.min',
      value: this.e.context.limit,
    }
  }

  stringMax () {
    return {
      ...this.baseData,
      type: 'string.max',
      value: this.e.context.limit,
    }
  }

  stringRegex () {
    return {
      ...this.baseData,
      type: 'string.regex',
    }
  }
}
