const bcrypt = require('bcrypt')

exports.hash = function (value) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(value, 10, function (err, hashed) {
      if (err) return reject(err)
      return resolve(hashed)
    })
  })
}

exports.checkHash = function (string, hashed) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(string, hashed, function (err, res) {
      if (err) return reject(err)

      if (res) return resolve(true)
      return resolve(false)
    })
  })
}
