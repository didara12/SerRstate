const express = require('express')
const yup = require('yup')
const users = require('../DB/connecte')
const bcrypt = require('bcryptjs')
const conf = require('../config')
const passport = require('passport')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const generalRoute = express.Router()

conf(passport)





const usersShema = yup.object({
    username: yup.string().max(15).required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required()
    
})

generalRoute.post('/signUp',async (req,res)=>{
    try{
        const obj  = req.body
        await usersShema.validate(obj)

        const data = await  users.findOne({$or:[{username:obj.username},{email:obj.email}]})
        if(data) throw new  Error("user already exists")
    
        const hash = bcrypt.hashSync(obj.password)
        const user = {...obj, password:hash}

        const u = new users(user)
        u.save(u).then(res => console.log(res))

        res.status(200).json({data: `user ${user.username} has been added` })
        

    }catch(e){
        console.error(e)
        res.status(400).json({error: e.message})
    }

})



generalRoute.post('/signIn',  (req,res,next)=>{

    passport.authenticate('local', {session:false},async (err,Sobj,info)=>{
        if(err)  return console.log(err.message)
        if(!Sobj) return res.status(400).json({error:info.error})

        res.status(200).json(Sobj)
    })(req,res,next)

})



 
generalRoute.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

generalRoute.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/fail' }),(req, res) => {

//    const clientIp = req.ip || req.connection.remoteAddress;
//    const userAgent = req.headers['user-agent'];
//    console.log(` callback::::::Request from ${clientIp}, User-Agent: ${userAgent}`);

//    const setCookieHeader = res.getHeaders()['set-cookie'];
//    console.log('Set-Cookie Header:', setCookieHeader);

    res.cookie('useANDtoken', req.user);
   res.redirect(`http://localhost:5173/`);  // you should use the domain  to get the cookie in the frontend  (i dont know why)
    
  }
);






generalRoute.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });





module.exports = generalRoute



