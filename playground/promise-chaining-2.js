const Task = require('../src/models/task.js')
const m = require('../src/db/mongoose');

m()
// Task.findByIdAndDelete('67f0fd958cca9fba5c935209').then((res) => {
//     console.log('User removed', res)
//     return Task.countDocuments({completness: false})
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log('Error', error)
// })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const uncompletedTasks = await Task.countDocuments({completness: false})
    return uncompletedTasks
}

deleteTaskAndCount('67f04f85af9eb9feb4ce60d6').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log('e', e)
})
