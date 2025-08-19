const express = require('express')
const app = express()
const port = '3001'

app.get('/', (req, res) => {
    res.send('test get')
})

app.listen(port, () => {
    console.log("server runs on the port" + port)
})