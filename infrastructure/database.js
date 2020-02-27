const mongoose = require('mongoose')

module.exports = async function ({ schemas, profile, hooks }) {
  const { connectionString } = profile

  // connect DB
  const con = await mongoose.createConnection(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  console.log('Connected to MongoDB at: %s', connectionString)

  // register schemas
  const models = {}
  for (const k in schemas) {
    // hooks
    if (hooks && hooks[k]) hooks[k](schemas[k])

    // models
    models[k] = con.model(k, schemas[k])
  }

  // close connection when app exit
  process.on('exit', (code) => {
    mongoose.connection.close()
    console.log('****** mongoose closed connection')
  })
  process.on('SIGINT', function () {
    process.exit()
  })

  return {
    connection: con,
    models,
  }
}
