const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const app = express()

//importing routes


//Adding middlewares
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use(logger())



const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`server started on port ${port}`)
})