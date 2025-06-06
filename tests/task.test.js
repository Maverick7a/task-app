const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const {user1, user1Id, user2, user2Id, setUpDatabase, taskOne, taskTwo, taskThree} = require('./fixtures/db');

beforeEach(setUpDatabase)

test('Should create task for user', async() => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send({
        description: 'From my test'
    })
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completness).toEqual(false)
})

test('Should fetch all task from one user', async() => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)

    const owner = response.body[0].owner
    const tasks = await Task.find({owner: owner})
    expect(tasks).not.toBeNull()
    expect(tasks.length).toEqual(1);

})

test('Should not delete the task by not owner', async() =>{
    const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(404)

    expect(response.body.length).not.toBeNull()

})