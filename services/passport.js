const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const userController = require('../controllers/user.controller');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: keys.jsonWebTokenSecret,
    issuer: keys.jsonWebTokenIssuer,
    audience: keys.jsonWebTokenAudience,
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.sub);
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (e) {
      return done(e, false);
    }
  })
);

passport.use(new GitHubStrategy(
  {
    clientID: keys.githubClientId,
    clientSecret: keys.githubClientSecret,
    callbackUrl: '/v1/auth/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ githubId: profile._json.id });
      if (existingUser) {
        await existingUser.update({ $set: { accessToken } });
        await userController.update(existingUser);
        return done(null, existingUser);
      }

      const user = await new User({
        githubId: profile._json.id,
        loginName: profile._json.login,
        displayName: profile._json.name,
        picture: profile._json.avatar_url,
        apiUrl: profile._json.url,
        webUrl: profile._json.html_url,
        accessToken: accessToken,
        created_at: profile._json.created_at,
        updated_at: profile._json.updated_at,
      }).save();
      await userController.update(user);
      done(null, user);
    } catch (e) {
      return done(e, false);
    }
  })
);
