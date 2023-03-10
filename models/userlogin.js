const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userlogin = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userlogin.statics.signup = async function (email, password) {

    if (!email || !password) {
        throw Error('please complate the password an email')
    }

    if (!validator.isEmail(email)) {
        throw Error('email is not enough')
    }

    if (!validator.isStrongPassword(password)) {
        throw Error('password is not strong')
    }

    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use')
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hash })

    return user
}

userlogin.statics.login = async function (email, password) {

    if (!email || !password) {
        throw Error('please complate the password an email')
    }
    const user = await this.findOne({ email })

    if (!user) {
        throw Error('inccourect email')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error('incourrect password')
    }

    return user

}

module.exports = mongoose.model('user', userlogin)