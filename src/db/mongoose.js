const mongoose = require('mongoose')

const m = async() => {
    await mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {})
}

module.exports = m