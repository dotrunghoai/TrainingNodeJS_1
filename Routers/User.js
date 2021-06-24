const express = require('express')

const { addUser, getAllUser, getUserById, updateUser, deleteUser, signIn } = require('../Controllers/User')
const auth = require('../Helpers/Auth')
const validator = require('../Helpers/Validator')

const router = express.Router()

router.post('/user/add', validator, addUser)
router.get('/user', auth, getAllUser)
router.get('/user/:id', auth, getUserById)
router.put('/user/:id', auth, validator, updateUser)
router.delete('/user/:id', auth, deleteUser)
router.post('/signin', signIn)

module.exports = router