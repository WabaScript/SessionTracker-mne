const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env'})

// Passport config
require('./config/passport')(passport)

// Call Database
connectDB()

// Initialize app
const app = express()

// Logging
// Outputs any request, HTTP methods, responses, etc. in the console
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars - middleware
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Express-Session - middleware
app.use(session({
    secret: 'ricardo',
    resave: false,
    saveUninitialized: false
}))

// Passport - middleware
app.use(passport.initialize())
app.use(passport.session())

// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`))