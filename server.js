const express = require('express')
const path = require('path')
const port = process.env.PORT || 8080
const app = express()

const dist = path.resolve(__dirname, 'dist')

app.use(express.static(dist))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(dist, '/index.html'))
})

app.listen(port)
