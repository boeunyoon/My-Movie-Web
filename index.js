const express = require('express')
const app = express()
const port = 8080

const mongoose = require('mongoose')
const connect = mongoose.connect('mongodb+srv://yboeun:dbsqhdms00@cluster0.9ocle.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
      useNewUrlParser: true, useUnifiedTopology: true
      //useCreateIndex: true, useFindAndModify: false
    }).then(() => console.log('MongoDB Connected...'))
      .catch(err => console.log(err))
app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세여')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})