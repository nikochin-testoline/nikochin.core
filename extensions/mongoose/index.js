const mongoose = require('mongoose')

require('./Schema')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
