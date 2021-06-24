const redis = require('redis')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const client = redis.createClient()

const deleteField = (user) => {
    delete user.password
    delete user.tokens
    delete user.role
    return user
}

const hashPassword = async (pass) => {
    return await bcrypt.hash(pass, 12)
}

const addUser = (req, res) => {
    try {
        const { id, firstname, lastname, email, password, age } = req.body
        client.get(id, async (err, reply) => {
            if (reply) {
                return res.status(400).send({ message: 'User already exist!' })
            }
            const user = {
                id,
                firstname,
                lastname,
                email,
                password: await hashPassword(password),
                age,
                role: 'user',
                tokens: []
            }
            client.set(id, JSON.stringify(user))
            const result = deleteField(user)
            res.status(201).send(result)
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: err.message })
    }
}

const getAllUser = (req, res) => {
    try {
        let userArr = []
        client.keys('*', (err, id) => {
            let keys = Object.keys(id)
            let idx = 0
            keys.forEach((loop) => {
                client.get(id[loop], (errS, obj) => {
                    idx++
                    if (errS) {
                        res.status(500).send({ message: errS })
                    } else {
                        userArr.push(deleteField(JSON.parse(obj)))
                    }
                    if (idx == keys.length) {
                        res.status(200).send(userArr)
                        return userArr
                    }
                })
            })
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Something went wrong!' })
    }
}

const getUser = (cb) => {
    try {
        let userArr = []
        client.keys('*', (err, id) => {
            let keys = Object.keys(id)
            let idx = 0
            keys.forEach((loop) => {
                client.get(id[loop], (errS, obj) => {
                    idx++
                    if (errS) {
                        console.log(errS)
                    } else {
                        userArr.push(JSON.parse(obj))
                    }
                    if (idx == keys.length) {
                        cb(userArr)
                    }
                })
            })
        })
    } catch (err) {
        console.log(err)
        return []
    }
}

const getUserById = (req, res) => {
    try {
        const { id } = req.params
        client.get(id, (err, reply) => {
            if (!reply) {
                return res.status(404).send({ message: 'Invalid User!' })
            }
            const result = deleteField(JSON.parse(reply))
            res.status(200).send(result)
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Something went wrong!' })
    }
}

const updateUser = (req, res) => {
    try {
        const { id } = req.params
        const { firstname, lastname, email, password, age } = req.body
        client.get(id, async (err, reply) => {
            if (!reply) {
                return res.status(404).send({ message: 'Invalid User!' })
            }
            const oldUser = JSON.parse(reply)
            const user = {
                id,
                firstname,
                lastname,
                email,
                password: await hashPassword(password),
                age,
                role: oldUser.role,
                tokens: oldUser.tokens
            }
            client.set(id, JSON.stringify(user))
            const result = deleteField(user)
            res.status(202).send(result)
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Something went wrong!' })
    }
}

const deleteUser = (req, res) => {
    try {
        const { id } = req.params
        // const id = ""
        client.get(id, (err, reply) => {
            if (!reply) {
                return res.status(404).send({ message: 'Invalid User!' })
            }
            client.del(id, (err, replyD) => {
                if (err) {
                    return res.status(500).send({ message: 'Something went wrong!' })
                }
                res.status(202).send({ message: 'Delete User Successfully!' })
            })
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Something went wrong!' })
    }
}

const signIn = async (req, res) => {
    try {
        const { id, password } = req.body
        getUser(async (userList) => {
            const foundUser = userList.find(item => item.id === id)
            if (!foundUser) {
                return res.status(400).send({ message: 'Tài khoản hoặc mật khẩu không đúng!' })
            }
            if (!(await bcrypt.compare(password, foundUser.password))) {
                return res.status(400).send({ message: 'Tài khoản hoặc mật khẩu không đúng!' })
            }
            const token = await jwt.sign(
                {
                    id: foundUser.id
                },
                "TrainingNodeJS",
                {
                    expiresIn: 7200
                }
            )

            client.get(id, async (err, reply) => {
                const oldUser = JSON.parse(reply)
                let { id, firstname, lastname, email, password, age, role, tokens } = oldUser
                tokens.push(token)
                const user = {
                    id,
                    firstname,
                    lastname,
                    email,
                    password,
                    age,
                    role,
                    tokens
                }
                client.set(id, JSON.stringify(user))
            })

            res.status(200).send(token)
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}


module.exports = { addUser, getAllUser, getUserById, updateUser, deleteUser, signIn, getUser }