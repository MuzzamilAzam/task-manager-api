const express = require('express')
const auth = require('../middlewares/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/accounts')
const User = require('../models/user')
const router = new express.Router()

// Create new user
router.post('/users',  async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})


// login user
router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        
        res.send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

// logging out user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// logging out all users
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        // console.log(req.user)
        req.user.tokens = []
        // console.log(req.user)
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


// read user profile
router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)

    // try {
    //     const users = await User.find({})
    //     res.send(users)
    // } catch (e) {
    //     res.status(500).send()
    // }
})

// read specific user by its id (this api route is not needed)
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)
//     } catch (e) {
//         res.status(500).send()
//     }

// })

// update a user's data 
router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation){
        return res.status(400).send({'error': 'Invalid updates'})
    }

    try {

        // const user = await User.findById(req.user._id)
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        // console.log(req.params)

        // if (!user) {
        //     return res.status(404).send()
        // }

        res.send(req.user)

    } catch (e) {
        res.status(400).send(e)
    }
})

// delete a user 
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        // if (!user) {
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


// uploading profile picture
const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000 // 1 mb maximum size of image
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please provide an image with extensions: jpg, jpeg, or png.'))
        }
        cb(undefined, true)
    }
})

// creating a user avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // console.log(req.file.buffer)
    // console.log()
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()

    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

// removing the avatar of the user
router.delete('/users/me/avatar', auth, async(req, res) => {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
})

router.get('/users/:id/avatar', async(req, res) => {
    try{
        const user = await User.findById(req.params.id)
        // console.log(user)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router