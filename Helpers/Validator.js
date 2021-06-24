const checkInput = (req, res, next) => {
    let { id, firstname, lastname, email, password, age } = req.body
    if (!id) {
        id = req.params.id
    }
    let errMessage = ""
    if (!age) {
        errMessage = "Age is required!"
    } else if (Number.parseInt(age) < 18) {
        errMessage = "Must be 18 years old!"
    }
    if (!password) {
        errMessage = "Password is required!"
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) {
        errMessage = "Weak password!"
    }
    if (!email) {
        errMessage = "Email is required!"
    } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        errMessage = "Invalid email!"
    }
    if (!lastname) {
        errMessage = "Last name is required!"
    }
    if (!firstname) {
        errMessage = "First name is required!"
    }
    if (!id) {
        errMessage = "ID is required!"
    }

    if (errMessage !== "") {
        return res.status(400).send({ message: errMessage })
    }
    next()
}

module.exports = checkInput