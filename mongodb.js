// const mongodb = require('mongodb')

// const MongoClient = mongodb.MongoClient


const { MongoClient, ObjectId } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectId()
// console.log(id.id.length)
// console.log(id.toHexString().length)
// console.log(id)
// console.log(id.toHexString())

MongoClient.connect(connectionURL , (error, client) => {
    if(error){
        return console.log('Error! unable to connect')
    }

    // console.log('Connection successful!')
    // explicitly creeating db is not necessary when we add something in the db, mongo automatically creates it.

    const db = client.db(databaseName)


    db.collection('tasks').deleteOne({
        description: 'Spend the first day of eid.'
    }).then((result) => console.log(result.deletedCount)).catch((error) => console.log(error))
    // db.collection('users').deleteMany({age: 25}).then((result) => console.log(result))

    // db.collection('users').updateMany({name: 'Muzzamil'}, {
    //     $inc: {
    //         age: 1
    //     },
    //     $set: {
    //         name: "Sahab"
    //     }
    // }).then((result) => {
    //     console.log(result)
    // })


    // db.collection('tasks').updateMany({}, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result)
    // })

    // db.collection('users').find({}).toArray((error, users) => {
    //     console.log(users)
    // })

    // db.collection('users').insertOne({
    //     name: "Alam",
    //     age: 23
    // }, (error, result) => {
    //     if (error){
    //         return console.log(error)
    //     }
    //     console.log('Success')
    // })

    // db.collection('users').findOne({_id: new ObjectId("60f88cf65e32f0dd69cb3969")}, (error, user) => {
    //     if (error){
    //         return console.log('Unable to fetch.')
    //     }
    //     console.log(user)

    // })

    // db.collection('users').find({age: 23}).toArray((error, users) => {
    //     console.log(users)
    // })

    // db.collection('users').find({age: 23}).count((error, count) => {
    //     console.log(count)
    // })


    // db.collection('tasks').findOne({_id: new ObjectId("60f885f83c80384c2e87a281")}, (error, task) => {
    //     console.log(task)
    // console.log('___________________________________________')

    // })

    // db.collection('tasks').find({completed: false}).toArray((error, t) => {
    //     console.log(t)
    // })
})
