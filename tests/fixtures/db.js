const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const user1Id = new mongoose.Types.ObjectId()

const user1 = {
    _id: user1Id,
    name: 'Daniel',
    email: 'd@icloud.com',
    password: '56what!',
    tokens: [{
        token: jwt.sign({_id: user1Id}, 'thisisournodejscourse')
    }]
}

const user2Id = new mongoose.Types.ObjectId()

const user2 = {
    _id: user2Id,
    name: 'Vasyl',
    email: 'v@icloud.com',
    password: '56whfdt!',
    tokens: [{
        token: jwt.sign({_id: user2Id}, 'thisisournodejscourse')
    }]
}

const user3Id = new mongoose.Types.ObjectId()

const user3 = {
    _id: user3Id,
    name: 'Mark',
    email: 'm@icloud.com',
    password: '56whfdt!',
    tokens: [{
        token: jwt.sign({_id: user2Id}, 'thisisournodejscourse')
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    owner: user1Id,
    completness: false
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    owner: user2Id,
    completness: true
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    owner: user3Id,
    completness: true
}

const setUpDatabase = async() => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(user1).save();
    await new User(user2).save();
    await new User(user3).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();

}

module.exports = {
    user1Id,
    user1,
    user2,
    user2Id,
    setUpDatabase,
    taskOne,
    taskTwo,
    taskThree
}