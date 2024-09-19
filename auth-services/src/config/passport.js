const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/authModel');
const config = require('./config');

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_Client_SECRET,
      callbackURL:
        config.GOOGLE_CALLBACK_URL ||
        'https://localhost:443/api/v1/auth/google/callback',
      passReqToCallback: true,
    },
    async function googleCallback(
      request,
      accessToken,
      refreshToken,
      profile,
      done,
    ) {
      // console.log(JSON.stringify(profile, null, 2));
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            email: profile.emails[0].value,
            googleId: profile.id,
            displayName: profile.displayName,
          });
          await user.save();
        }

        return done(null, profile);
      } catch (error) {
        return done(error, profile);
      }
    },
  ),
);

// passport.serializeUser(function(user,done){
//   done(null,user._id)
// })

passport.serializeUser(function myNamed(user, done) {
  done(null, user);
});

passport.deserializeUser(function myNoNamed(user, done) {
  done(null, user);
});

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     console.log('Deserialized User:', user);
//     done(null, user);
//   } catch (err) {
//     done(err, false);
//   }
// })
