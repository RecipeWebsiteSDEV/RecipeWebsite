const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
require('dotenv').config();
const Recipes = require('./models/recipes');
const User = require('./models/User');
const { receiveMessageOnPort } = require('worker_threads');

// express app
const server = express();

const dbURI = process.env.MONGO_DB_URI;
mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        
    })
    .then((result) => server.listen(3001))
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
    res.redirect('/recipes');
});

server.post("/", (req, res) => {
  selectedIngredients = Object.values(req.body)
  Recipes.find().sort({ createdAt: -1 })
    .then((result) => {
      const recipeContainsList = result.map(recipe => {
        const recipeContains = {
          "name": recipe.name,
          "matchedIngredients": [],
          "matchPercentage": 0,
          "recipeColor": "red",
        };
        selectedIngredients.forEach(selectedIngredient => {
          if (recipe.ingredients.includes(selectedIngredient)) {
            recipeContains["matchedIngredients"].push(selectedIngredient);
          }
        });
        recipeContains["matchPercentage"] = recipeContains["matchedIngredients"].length / recipe.ingredients.length;
        if (recipeContains["matchPercentage"] == 1) {
          recipeContains["recipeColor"] = "green";
        } else if (recipeContains["matchPercentage"] > 0) {
          recipeContains["recipeColor"] = "yellow";
        } else if (recipeContains["matchPercentage"] == 0) {
          recipeContains["recipeColor"] = "red";
        }
        return recipeContains;
      });
      const encodedRecipeContains = encodeURIComponent(JSON.stringify(recipeContainsList));
      res.redirect(`/recipes?recipeContains=${encodedRecipeContains}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

server.get('/recipes', (req, res) => {
  let recipeContains;
  Recipes.find().sort({ createdAt: -1 })
    .then((result) => {
      if (Object.keys(req.query).length === 0) {
        const recipeContainsList = result.map(recipe => ({
          name: recipe.name,
          matchedIngredients: [],
          recipeColor: "white"
        }));
        recipeContains = recipeContainsList;
      } else {
        recipeContains = JSON.parse(decodeURIComponent(req.query.recipeContains));
      }
      
      const uniqueIngredients = [];
      result.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
          if (!uniqueIngredients.includes(ingredient)) {
            uniqueIngredients.push(ingredient);
          }
        });
      });
      uniqueIngredients.sort();

      res.render('home', {
        title: 'Recipes',
        recipes: result,
        uniqueIngredients: uniqueIngredients,
        recipeContains: recipeContains,
      });
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