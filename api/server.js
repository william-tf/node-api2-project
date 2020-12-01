const express = require('express')
const server = express();

const postRouter = require('./posts/posts-router')

server.use(express.json())
server.use('/api/posts', postRouter)
server.get('/', (req, res) => {
    res.send(
        `<h1>hey</h1>`
    )
})

module.exports = server
