const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')
const compression = require('compression')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const app = express()

//importing routes
const authRoutes = require('./routes/authRoute')

//Adding middlewares
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(compression())
app.use(logger('dev'))

app.use('/auth/', authRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`server started on port ${port}`)
})
