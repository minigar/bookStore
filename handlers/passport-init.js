const passport = require("passport");
const passportConfig = require("../lib/passport-config");

passportConfig(passport);


module.exports = passport.initialize();