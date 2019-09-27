const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { jwtSecret, server: { host, port } } = require('../config')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: [
            'admin',
            'member'
        ]
    },
    hash: String,
    salt: String
}, { collection: 'users' })

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
}
userSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
    return this.hash === hash
}
userSchema.methods.generateJwt = function() {
    return jwt.sign({
        iss: `${host}:${port.api}`,
        _id: this._id,
        name: this.name,
        role: this.role,
        exp: parseInt(Date.now() / 1000 + 60 * 60)
    }, jwtSecret)
}

const User = mongoose.model('User', userSchema)
module.exports = User