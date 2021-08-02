const app = require('../src/app')
const request = require('supertest')
const {
    userOne, 
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setUpDatabase} = require('./fixtures/db')
const Task = require('../src/models/task')

beforeEach(setUpDatabase)

test('Should create a task for user', async () => {

    const response = await request(app)
                            .post('/tasks')
                            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                            .send({
                                description: 'Creating task for test'
                            })
                            .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(response.body.completed).toEqual(false)
    // expect(response.body.descr)
})

test('Should get tasks for user one', async () => {
    const response = await request(app)
                        .get('/tasks')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .send()
                        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should not delete other users tasks', async () => {
    const response = await request(app)
                        // .delete('/tasks/' + taskOne._id)
                        .delete('/tasks/' + taskOne._id)
                        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
                        .send()
                        .expect(404)
    
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})