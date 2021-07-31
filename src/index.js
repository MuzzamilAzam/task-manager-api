const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

// const multer = require('multer')

// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(doc|docx)$/) ){
//             return cb(new Error('File must be a doc or docx'))
//         }
//         cb(undefined, true)
//     }
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })



// make express automatically parse JSON
app.use(express.json())

// using user and task routers defined in separte files
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log("The server is running at port: " + port)
})