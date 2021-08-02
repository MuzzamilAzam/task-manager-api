const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

// make express automatically parse JSON
app.use(express.json())

// using user and task routers defined in separte files
app.use(userRouter)
app.use(taskRouter)

module.exports = app