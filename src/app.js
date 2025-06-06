const express = require('express')
const m = require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
m()

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled!')
//     } else {
//         next()
//     }
// })


// app.use((req, res, next) => {
//     res.status(503).send({message: "Maintenance break"})
// })

// Parsing incoming json to an Object
app.use(express.json())
// app.use(userRouter)

//User Routers
app.use("/users", userRouter);

//Task Routers
app.use("/tasks", taskRouter)

const Task = require("./models/task");
const User = require("./models/user");

const main = async() => {
    // const task = await Task.findById('681767d002f7bb42f159054e');
    // console.log(task.owner);

    const user = await User.findById('681767aa02f7bb42f1590548');
    console.log(user)
}

main();

module.exports = app

