const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
require('dotenv').config();
const Recipes = require('./models/recipes');
const User = require('./models/User');
const Ingredients = require('./models/ingredients');

// express app
const server = express();

// middleware
/* app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser()); */

const dbURI = process.env.MONGO_DB_URI;
mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        
    })
    .then((result) => server.listen(3000))
    .catch((err) => console.log(err))
    console.log("Connected")
module.exports = mongoose;

// register view engine
server.set('view engine', 'ejs')

// middleware and static files
server.use(express.json());
server.use(express.static('public'));
server.use(cookieParser());
server.use(express.urlencoded({
    extended: true
}))

server.use(authRoutes);

// Home page
server.get('/', (req, res) => {
    // res.render('home', {
    //     title: "Home"
    // })
    res.redirect('/recipes');
});

server.get('/recipes', (req, res) => {
    Recipes.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('home', {
                title: 'Recipes',
                recipes: result
            })
        })
        .catch((err) => {
            console.log(err);
        });
});

// Login page
server.get('/login', (req, res) => {
    res.render('login', {
        title: "Login"
    })
});

// Signup page
server.get('/signup', (req, res) => {
    res.render('signup', {
        title: "Signup"
    })
});

// Profile page
server.get('/profile', (req, res) => {
    res.render('profile', {
        title: "Profile"
    })
});

// HowTo page
server.get('/howTo', (req, res) => {
    res.render('howTo', {
        title: "howTo"
    })
});

// About page
server.get('/about', (req, res) => {
    res.render('about', {
        title: "About"
    })
});

// 404 page 
server.use((req, res) => {
    res.status(404).render('404', {
        title: '404 Page'
    });
})



server.listen(3000, 'localhost', () => {
    console.log('listening for requests on port 3000');
});