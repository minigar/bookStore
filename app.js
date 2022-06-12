require('dotenv').config()


const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const passport = require('passport');
require('./lib/passport-config')(passport)
const session = require('express-session')


const auth = require('./controllers/auth');
const config = require('./lib/config');
const mongooseConfig = require('./lib/mongoose-config');
const controllers = require('./controllers')

const app = express();
const router = express.Router();




app.use(bodyParser.json());
app.use(cookieParser())

app.use('/api', router);
app.use('/api', controllers)
app.use('/api/auth', auth)


app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    cookie: config.session.cookie
}));

router.get('/', passport.authenticate('jwt', { session: false}), async(req, res) => {
    res.send("HI")
})

mongooseConfig();

app.listen(config.port, () => {
    console.log(`Api has been started on port ${config.port}`)
})
