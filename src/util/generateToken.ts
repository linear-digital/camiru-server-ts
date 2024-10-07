// const jwt = require('jsonwebtoken')
// const { encrypter } = require('./encrypter')
// const generateToken = async (user: any, time: string, role: string) => {
//     const id = encrypter(user._id)
//     const token = await jwt.sign({
//         id: id,
//         role: role || "center"
//     }, process.env.JWT_SECRET, {
//         expiresIn: time
//     })
//     return token
// }
// module.exports = generateToken
import jwt from 'jsonwebtoken'
import { encrypt } from './security'

const generateCenterToken = async (user: any, time: string, sessionId: string) => {
    const secret = process.env.JWT_SECRET as string
    console.log(secret);
    const id = encrypt(user._id)
    const session = encrypt(sessionId)
    const token = await jwt.sign({
        id: id,
        session
    }, secret, {
        expiresIn: time
    })
    return token
}

const tokenGenerator = {
    generateCenterToken
}
export default tokenGenerator