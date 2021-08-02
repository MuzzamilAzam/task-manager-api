const app = require('../src/app')
const request = require('supertest')
const {userOne, userOneId, setUpDatabase} = require('./fixtures/db')
const User = require('../src/models/user')

// runs before each test
beforeEach(setUpDatabase)

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Muzzamil Azam Test',
        email: 'muzzamil@test.com',
        password: 'MyPass666!!'
    }).expect(201)
    
    // checking wether the user is successfully saved in the database
    const user = await User.findById(response.body.user._id)
    // console.log(response.body.user._id)
    expect(user).not.toBeNull()

    // assertion about response
    // expect(response.body.user.name).toBe('Muzzamil Azam Test') // checking a single property

    expect(response.body).toMatchObject({
        user: {
            name: 'Muzzamil Azam Test',
            email: 'muzzamil@test.com'
        },
        token: user.tokens[0].token
    })

    // make sure password is stored after hashing
    expect(response.body.user.password).not.toBe('MyPass666!!')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    // validate new token is saved
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})


test('Should not login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'wrongpassword'
    }).expect(400)

})


test('Should get profile of user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})


test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    // checking database to validate the user is actually deleted
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})


test('Should upload image avatar', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Sultan'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Sultan')
}) 


test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Lyari'
        })
        .expect(400)
})