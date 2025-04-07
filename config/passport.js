const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        //find user by email from the google profile
        let user=await User.findOne({email:profile.emails[0].value});
        if(!user){
            // register a new user if not found

            user=new User({
                username:profile.displayName,
                email:profile.emails[0].value,
                googleId:profile.id,
                password:null,
            });
            await user.save();

            //generate jwt tokens for the user

            const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:"1h",});

            return done(null,{token,user});


        }
      } catch (error) {
        return done(err,null);
      }
    }
  )
);

module.exports=passport;
