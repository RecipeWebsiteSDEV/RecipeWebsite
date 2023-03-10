const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
require('dotenv').config();

const server = express();

// register view engine
server.set('view engine', 'ejs')

// middleware and static files
server.use(express.static('public'));
server.use(express.urlencoded({
    extended: true
}))

// Home page
server.get('/', (req, res) => {
    res.render('home', {
        title: "Home"
    })
});

// Login page
server.get('/login', (req, res) => {
    res.render('login', {
        title: "Login"
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