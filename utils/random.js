exports.randomInt = function (max = 999, min = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

exports.randomDate = function (from, to) {
  return new Date(+from + Math.random() * (to - from))
}
