const app = require('./app')

const port = process.env.PORT

app.listen(port, () => {
    console.log("The server is running at port: " + port)
})