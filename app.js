const express = require('express');
const mongoose = require('mongoose');
const hbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const passport = require('passport');
const {globalVariables} = require('./config/config');
const {selectOption} = require('./config/customFunctions');
const {mongoDBUrl} = require('./config/config');


const app = express();

// connect to MongoDB
mongoose.connect(mongoDBUrl,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => {
        app.listen(3000, ()=> {
            console.log('Connect to MongoDB and server is ready');
        });
    })
    .catch(err => {
        console.log(err);
    })

// set view engine
// if we later chose to use app.render("some page") function to render our page
// it will render the "layouts/default.handlebars" first then render our "some page"
// if there is a {{{ body }}} in the default.handlebars
app.engine('handlebars', hbs({defaultLayout: 'default', helpers: {select:selectOption}}));
app.set('view engine', 'handlebars');

// method override middleware
app.use(methodOverride('newMethod'));

// middleware
app.use(express.json()); // recognizing the incoming Request Object as a JSON Object
app.use(express.urlencoded({extended: true})); // recognizing the incoming Request Object as strings or arrays.
app.use(express.static(path.join(__dirname, 'public')));



// register a session, session helps in saving the data in the key-value form in the server
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}));

// initialized passport and connect passport and session
app.use(passport.initialize());
app.use(passport.session());


// use flash to display reminder message
app.use(flash());

// use the global variable for the message
app.use(globalVariables);

// file upload middleware
app.use(fileUpload());

// routes
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);

