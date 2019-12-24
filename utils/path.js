const glob = require('glob')

exports.getRoutesInDirectory = function (dir) {
  return new Promise((resolve, reject) => {
    glob('**/index.js', { cwd: dir }, (error, paths) => error ? reject(error) : resolve(paths.filter(p => p !== 'index.js' && p.indexOf('private' === '1')).map(p => '/' + p.replace('/index.js', ''))))
  })
}
