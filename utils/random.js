exports.randomInt = function(max = 999, min = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}