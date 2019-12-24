const mongoose = require('mongoose')

module.exports = async function ({ schemas, profile, hooks }) {
  const { connectionString } = profile

  // connect DB
  const con = await mongoose.createConnection(connectionString, { useNewUrlParser: true })
  console.log('Connected to MongoDB at: %s', connectionString)

  // register schemas
  const models = {}
  for (const k in schemas) {
    // hooks
    if (hooks && hooks[k]) hooks[k](schemas[k])

    // models
    models[k] = con.model(k, schemas[k])
  }

  return {
    connection: con,
    models,
  }
}
