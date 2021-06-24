const express = require('express')
const bodyParser = require('body-parser')

const routerUser = require('./Routers/User')

const app = express()
app.use(bodyParser.json())

app.use(routerUser)

if (!module.parent) {
    app.listen(2300, () => {
        console.log('Listening at port 2300...')
    })
}

module.exports = app