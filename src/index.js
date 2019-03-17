const express = require('express')
require('./db/mongoose') // Connects mongoose to database
const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')

const app = express()
const port = process.env.PORT || 3000



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=>{
    console.log('server is up on port ' + port)
})
