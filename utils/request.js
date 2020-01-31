const formidable = require('formidable')
const mime = require('mime-types')
const passport = require('passport')

exports.withNode = withNode
exports.withSession = withSession
exports.withAuthen = withAuthen
exports.withSocketSession = withSocketSession
exports.withFile = middlewareFormFile(false)
exports.withFileBody = middlewareFormFile(true)
exports.withStreamUploader = withStreamUploader

function withNode (req, res, next) {
  req.node = req.body.node
  next()
}
function withSession (req, res, next) {
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    // TODO: should add log to see why failed
    if (!err && user) {
      req.user = user
    }

    return next()
  })(req, res, next)
}
function withAuthen (req, res, next) {
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    // TODO: should add log to see why failed

    if (err) {
      return res.status(500).send('Thất bại xác thực.')
    }

    if (!user) {
      return res.status(401).end()
    }

    req.user = user

    return next()
  })(req, res, next)
}
function withSocketSession (ws, req, next) {
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    // TODO: should add log to see why failed
    if (!err && user) {
      req.user = user
    }

    return next()
  })(req, null, next)
}

/**
 * Not yet implemented.
 * stream the files in request and pass in callback
 * @param callback: (stream) => {}
 */
function withStreamUploader (callback) {
  return function (req, res, next) {
    next()
  }
}

//
//
// =====================================
// ============= Private ===============
// =====================================
//
//
function middlewareFormFile (isSameBody) {
  return function (req, res, next) {
    var form = new formidable.IncomingForm()

    form.keepExtensions = true

    form.parse(req, function (err, fields, files) {
      if (err) {
        console.error('drivers/request-form-file.withFile')
        console.log(err)

        return next()
      } else {
        for (const k in files) {
          let f = files[k]
          files[k] = {
            name: randomFileName(mime.extension(f.type)),
            extension: mime.extension(f.type),
            path: f.path,
            file: f,
          }
        }

        if (!isSameBody) {
          req.body = fields
          req.files = files
        } else {
          req.body = Object.assign({}, fields, files)
        }
        return next()
      }
    })
  }
}

function randomFileName (extension) {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '.' + extension
}
