const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {user1, user1Id, setUpDatabase} = require('./fixtures/db');

beforeEach(setUpDatabase)

test('Should signup a new user', async() => {
    const response = await request(app).post('/users').send({
        name: 'Roman',
        email: 'roman@gmail.com',
        password: 'Gabellina12'
    }).expect(201)

    const user = await User.findById(response.body._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({ 
            name: 'Roman',
            email: 'roman@gmail.com'
    })
})

test('Should login existing user', async() => {
    const response = await request(app).post('/users/login').send({
        email: user1.email,
        password: user1.password
    }).expect(200)
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login user with bad credentials', async() => {
    await request(app).post('/users/login').send({
        email: "BadCreadential@gmail.com",
        password: 'SDKLJGSD'
    }).expect(400)
})

test('Should get profile for user', async() => {
    await request(app).get('/users/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async() => {
    await request(app).get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user' , async() => {
    request(app).delete('/users/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not delete account for unauthenticated user', async() => {
    request(app).delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async() => {
    await request(app).post('/users/me/avatar')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/Legend Pasha.jpg')
    .expect(200)
    const user = await User.findById(user1Id);
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async() => {
    const response = await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send({
        name: 'Roman'
    })
    console.log(response.body)
    const user = await User.findById(response.body._id)
    expect(user).not.toBeNull()

    expect(response.body.name).toBe(user.name)
})

test('Should not update invalid user fields', async() => {
    const response = await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send({
        location: 'Rome'
    }).expect(400)
})