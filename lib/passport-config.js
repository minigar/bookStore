const { Strategy, ExtractJwt }  = require('passport-jwt')

const config = require('./config')
const User = require('../models/User')

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
}

module.exports = (passport) => {
    passport.use(new Strategy(opts, function (payload, done) {
        User.findOne({id: payload.id}, function(err, user) {

        if (err) {
            return done(err, false);
        }

        if (user) {
            done(null, user)
        }
        else {
            done(null, false)
        }
    });
    }));
};