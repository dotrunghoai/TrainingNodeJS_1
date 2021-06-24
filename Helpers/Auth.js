const jwt = require('jsonwebtoken')
const { getUser } = require('../Controllers/User')

const Auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', "")
        const decoded = jwt.verify(token, "TrainingNodeJS")
        getUser((userList) => {
            const foundUser = userList.find((item) => item.id === decoded.id && item.tokens.includes(token))
            if (!foundUser) {
                return res.status(401).send({ message: 'You are not authorized!' })
            }
            req.user = foundUser
            req.token = token
            next()
        })
    } catch (error) {
        console.log(error)
        res.status(401).send({ message: 'You are not authorized!' })
    }
}

module.exports = Auth