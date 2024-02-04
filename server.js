const express = require('express')
require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
const {Real_state,googleUser, users}  = require('./DB/connecte')
const session = require('express-session');
const passport = require('passport')
// const { isUserAuthenticated } = require('./middlewares/isAuth')
const jwt = require('jsonwebtoken')
const conf = require('./config')
const path = require('path')
require('dotenv').config()





const app = express()
// app.use(cors({
//    // origin: ['http://192.168.0.173:5173'],
//    origin: ['http://localhost:5173'],
//    methods: "GET,POST,PUT,DELETE",
//    credentials: true, // if you're dealing with cookies and authentication
//  }));
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use(
   session({ secret: 'your-secret-key', resave: true, saveUninitialized: true })
 );

 app.use(passport.initialize());
app.use(passport.session());

conf(passport)

app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.use('/cust/auth',passport.authenticate('jwt', {session:false , failureRedirect:'/fail'}))


app.get('/fail',(req,res)=>{
   console.log('fail ')

   res.json({error: 'fail'})
})



app.get('/', (req, res) => {
   res.send('Welcome to the homepage!');
 })




 app.get('/home', async (req,res)=>{

   // const clientIp = req.ip || req.connection.remoteAddress;
   // const userAgent = req.headers['user-agent'];
   // console.log(` home::::::Request from ${clientIp}, User-Agent: ${userAgent}`);

   
    const data = await Real_state.find();
    res.status(200).json({data})

 })
 

 app.get('/Rapp/:id', async (req,res)=>{
   const id = req.params.id
   
   const data = await Real_state.findOne({_id:id});
   res.status(200).json({data})

})

 

 

app.post("/user",async (req, res) => {
   try {
      const token = req.body.token
      if(!token) return res.json({error:"you must login first"})
      const data =await jwt.verify(token,process.env.KEY)

      let muser = await googleUser.findOne({ _id: data.id }, { __v:0 })
      if(!muser ) muser = await users.findOne({ _id: data.id}, {__v:0 , password:0})  

      if(!muser) return res.json({error:"your token is wrong"})
      
      const user = {
         uid:muser._id,
         username:muser.username,
         email:muser.email,
         photo:muser.photo
      }
      res.status(200).json({user})

      // res.json({data:req.user})
   
   } catch (e) {
      res.json({error:e.message})
   }

});










app.use('/general', require('./routes/general'))
app.use('/cust', require('./routes/auth'))

const port = process.env.PORT
app.listen(port, console.log(`listening on port ${port}`))

