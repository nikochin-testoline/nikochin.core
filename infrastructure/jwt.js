const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const globalConfig = require('@/profiles').global
const { ObjectId } = require('../alias')

module.exports = function ({
  findUsernamePassword,
  verifyPayload
}) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: globalConfig.jwtSecret,
    ignoreExpiration: true
  }

  return function initApp (app) {
    app.use(passport.initialize())

    passport.serializeUser(function (user, done) {
      done(null, user)
    })

    passport.deserializeUser(function (sessionUserInfo, done) {
      done(null, sessionUserInfo)
    })

    passport.use(
      'login',
      new LocalStrategy(
        {
          usernameField: 'username',
          passwordField: 'password',
          passReqToCallback: true,
          session: false
        },
        async (req, username, password, done) => {
          try {
            let { result: user } = await getUser(username, password, req.node)

            if (user == null) {
              return done(null, false)
            }

            return done(null, user)
          } catch (error) {
            done(error)
          }
        }
      )
    )

    passport.use(
      'jwt',
      new JWTStrategy({
        ...opts,
        passReqToCallback: true
      },
      async (req, payload, done) => {
        try {
          let success = await validateTokenPayload(payload)

          if (success) {
            payload.appUserId = ObjectId(payload.appUserId)
            payload.userDetailId = ObjectId(payload.userDetailId)

            req.currentUserId = payload.userDetailId

            done(null, payload)
          } else {
            done(null, false)
          }
        } catch (error) {
          console.log('(microservices/passport/jwt) : Error occurred for JWT')
          done(error)
        }
      }
      )
    )
  }

  // =========== Private ==============
  async function getUser (username, password, node) {
    return findUsernamePassword({ username, password, node })
  }
  async function validateTokenPayload (payload) {
    return verifyPayload ? verifyPayload(payload) : true
  }
}
