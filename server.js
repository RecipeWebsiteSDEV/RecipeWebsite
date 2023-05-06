const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const Recipes = require('./models/recipes');
const Users = require('./models/users');
const Ingredients = require('./models/ingredients');

// express app
const server = express();

const dbURI = process.env.MONGO_DB_URI;
mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((result) => server.listen(3000))
    .catch((err) => console.log(err))
module.exports = mongoose;

// register view engine
server.set('view engine', 'ejs')

// middleware and static files
server.use(express.static('public'));
server.use(express.urlencoded({
    extended: true
}))

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
          "recipeColor": "red"
        };
        selectedIngredients.forEach(selectedIngredient => {
          if (recipe.ingredients.includes(selectedIngredient)) {
            recipeContains["matchedIngredients"].push(selectedIngredient);
          }
        });
        const count = recipeContains["matchedIngredients"].length / recipe.ingredients.length;
        if (count == 1) {
          recipeContains["recipeColor"] = "green";
        } else if (count > 0) {
          recipeContains["recipeColor"] = "yellow";
        } else if (count == 0) {
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
    const recipeContains = JSON.parse(decodeURIComponent(req.query.recipeContains || 'null'));
    Recipes.find().sort({
            createdAt: -1
        })
        .then((result) => {
            const uniqueIngredients = []
            result.forEach(recipe => {
                let index = 0
                while (index < recipe.ingredients.length) {
                    const ingredient = recipe.ingredients[index]
                    if (!uniqueIngredients.includes(ingredient)) {
                        uniqueIngredients.push(ingredient)
                    }
                    index++
                }
                uniqueIngredients.sort()
            });
            res.render('home', {
                title: 'Recipes',
                recipes: result,
                uniqueIngredients: uniqueIngredients,
                recipeContains: recipeContains,
            })
        })
        .catch((err) => {
            console.log(err);
        });
})

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