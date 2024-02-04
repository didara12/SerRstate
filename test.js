const bcrypt = require('bcryptjs')
const crypto = require('crypto')



const f = async()=>{
    const hash = await crypto.randomBytes(64).toString('base64')
    console.log(hash)
}


f()