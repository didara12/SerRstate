const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const {users, googleUser} = require('./DB/connecte')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const jwt = require('jsonwebtoken')
require('dotenv').config()


const conf = (passport)=>{
    //local
    try{
        passport.use(new LocalStrategy({ usernameField: 'email' },async(email, password, done) => {

            const user = await users.findOne({email})
            if(!user) return done(null,false,{error: "incorect email"})
             
            
            const bool = bcrypt.compareSync(password,user.password)
            if(!bool) return done(null,false,{error: "incorect password"})

            const token = jwt.sign({id:user._id},process.env.KEY)
            
            const userData = {
                username:user.username,
                email:user.email,
                uid:user._id.toString()
            }


            const Sobj = {
                token,userData
            }

            done(null,Sobj)




        }

         
        
        ))

 
 // google Oauth

        
        passport.use( new GoogleStrategy(
            {
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SEC,
                callbackURL: 'http://localhost:5000/general/auth/google/callback',
                passReqToCallback: true,
            },
            async (req,accessToken, refreshToken, profile, done) => {

                const user = await googleUser.findOne({_id:profile.id})
                
                const userData = {
                    uid:profile.id,
                    username:profile.displayName,
                    email:profile.emails[0].value,
                    photo:profile.photos[0].value
                }
                
                
                if(!user){
                    const u = googleUser({
                        _id:profile.id,
                        username:profile.displayName,
                        email:profile.emails[0].value,
                        photo:profile.photos[0].value
                    })
                    u.save(u)
                }

                const cookieToken = jwt.sign({id:profile.id}, process.env.KEY,{expiresIn:'1h'})

                return done(null, {cookieToken,userData});
            }
            )
        );


        passport.serializeUser((user, done) => {
            done(null, user);
        });
        
        passport.deserializeUser((user, done) => {
            done(null, user);
        });




        // --------------jwt

        const jwtOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.KEY
        };
    

        passport.use(new JwtStrategy(jwtOptions,(pyload,done)=>{
            done(null,pyload)
        }))
    



    
    }catch(error){
        done(error)
    }
}

module.exports = conf


