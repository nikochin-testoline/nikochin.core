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
      default:
        console.error(this.e)
        return {
          name: this.fieldName,
          type: this.e.type,
        }
    }
  }

  get fieldName () {
    return this.e.path.replace('body.', '').replace('query.', '').replace('params.', '')
  }

  required () {
    return {
      name: this.fieldName,
      type: 'required',
    }
  }

  stringMin () {
    return {
      name: this.fieldName,
      type: 'string.min',
      value: this.e.context.limit,
    }
  }

  stringMax () {
    return {
      name: this.fieldName,
      type: 'string.max',
      value: this.e.context.limit,
    }
  }
}
