const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
require("dotenv").config();
const Recipes = require("./models/recipes");
const User = require("./models/User");

// express app
const server = express();

const dbURI = process.env.MONGO_DB_URI;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => server.listen(3001))
  .catch((err) => console.log(err));
console.log("Connected");
module.exports = mongoose;

// register view engine
server.set("view engine", "ejs");

// middleware and static files
server.use(express.json());
server.use(express.static("public"));
server.use(cookieParser());
server.use(
  express.urlencoded({
    extended: true,
  })
);

server.use(authRoutes);

// Home page
server.get("/", (req, res) => {
  res.redirect("/recipes");
});

server.post("/", (req, res) => {
  selectedIngredients = Object.values(req.body);
  Recipes.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      const recipeContainsList = result.map((recipe) => {
        const recipeContains = {
          name: recipe.name,
          matchedIngredients: [],
          matchPercentage: 0,
          recipeColor: "red",
        };
        selectedIngredients.forEach((selectedIngredient) => {
          if (recipe.ingredients.includes(selectedIngredient)) {
            recipeContains["matchedIngredients"].push(selectedIngredient);
          }
        });
        recipeContains["matchPercentage"] =
          recipeContains["matchedIngredients"].length /
          recipe.ingredients.length;
        if (recipeContains["matchPercentage"] == 1) {
          recipeContains["recipeColor"] = "green";
        } else if (recipeContains["matchPercentage"] > 0) {
          recipeContains["recipeColor"] = "yellow";
        } else if (recipeContains["matchPercentage"] == 0) {
          recipeContains["recipeColor"] = "red";
        }
        return recipeContains;
      });
      const encodedRecipeContains = encodeURIComponent(
        JSON.stringify(recipeContainsList)
      );
      res.redirect(`/recipes?recipeContains=${encodedRecipeContains}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

server.get("/recipes", (req, res) => {
  let recipeContains;
  Recipes.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      if (Object.keys(req.query).length === 0) {
        const recipeContainsList = result.map((recipe) => ({
          name: recipe.name,
          matchedIngredients: [],
          recipeColor: "white",
        }));
        recipeContains = recipeContainsList;
      } else {
        recipeContains = JSON.parse(
          decodeURIComponent(req.query.recipeContains)
        );
      }

      const uniqueIngredients = [];
      result.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          if (!uniqueIngredients.includes(ingredient)) {
            uniqueIngredients.push(ingredient);
          }
        });
      });
      uniqueIngredients.sort();

      res.render("home", {
        title: "Recipes",
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
server.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

// Signup page
server.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Signup",
  });
});

// HowTo page
server.get("/howTo", (req, res) => {
  res.render("howTo", {
    title: "howTo",
  });
});

// About page
server.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
  });
});


// Profile page redirects to login if not logged in
server.get("/profile", checkUser, (req, res) => {
  const userId = res.locals.user ? res.locals.user._id : null;
  User.findById(userId)
    .sort({ createdAt: -1 })
    .then((result) => {
      const username = result.email
  Recipes.find({ author: username})
  .sort()
  .then(result => {
    res.render("profile", {
      title: "User Profile",
      recipes: result
    })
    })
  })
});

server.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  Recipes.findByIdAndDelete(id)
    .then(result => {
      res.redirect('/recipes')
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "An error occurred while deleting the recipe."
      });
    });
});

server.get("/update/:id", (req, res) => {

  Recipes.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      const uniqueIngredients = [];
      result.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          if (!uniqueIngredients.includes(ingredient)) {
            uniqueIngredients.push(ingredient);
          }
        });
      });
      uniqueIngredients.sort();
      Recipes.findById(id)
        .then(result => {
          res.render("update", {
            title: "Update Recipe",
            recipe: result,
            uniqueIngredients: uniqueIngredients,
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: "An error occurred while updating the recipe."
          });
        });
    })
    .catch((err) => {
      console.log(err);
    });

  const id = req.params.id;
});

// Update Recipe route
server.post("/update/:id", checkUser, (req, res) => {
  const id = req.params.id;
  
  Recipes.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      const uniqueIngredients = [];
      result.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          if (!uniqueIngredients.includes(ingredient)) {
            uniqueIngredients.push(ingredient);
          }
        });
      });
      uniqueIngredients.sort();

      let ingredientsList = req.body.ingredients; // Use existing ingredients from the form

      if (req.body.newIngredients.length !== 0) {
        const rawNewIngredients = req.body.newIngredients.split(",");
        rawNewIngredients.forEach((newIngredient) => {
          const trimmedIngredient = newIngredient.trim();
          if (!uniqueIngredients.includes(trimmedIngredient)) {
            ingredientsList.push(trimmedIngredient);
          }
        });
      }

      if (req.body.description === "") {
        req.body.description = "No description available.";
      }

      const userId = res.locals.user ? res.locals.user._id : null;
      User.findById(userId)
        .sort({ createdAt: -1 })
        .then((result) => {
          const username = result.email

      const newRecipeInfo = {
        name: req.body.name,
        author: username,
        description: req.body.description,
        dishType: req.body.dishType,
        difficulty: req.body.difficulty,
        instructions: req.body.instructions,
        ingredients: ingredientsList, // Use updated ingredients list
      };

      Recipes.findByIdAndUpdate(id, newRecipeInfo)
        .then((result) => {
          res.redirect("/profile");
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: "An error occurred while updating the recipe.",
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "An error occurred while fetching existing recipes.",
      });
    });
});

server.get("/create", checkUser, (req, res) => {
  Recipes.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      const uniqueIngredients = [];
      result.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          if (!uniqueIngredients.includes(ingredient)) {
            uniqueIngredients.push(ingredient);
          }
        });
      });
      uniqueIngredients.sort();
      res.render("create", {
        title: "Create Recipe",
        uniqueIngredients: uniqueIngredients,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

server.post("/create", checkUser, (req, res) => {
  Recipes.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      const uniqueIngredients = [];
      result.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          if (!uniqueIngredients.includes(ingredient)) {
            uniqueIngredients.push(ingredient);
          }
        });
      });
      uniqueIngredients.sort();

      let ingredientsList = [];

      if (req.body.newIngredients.length !== 0) {
        ingredientsList.push(req.body.ingredients)
        const rawNewIngredients = req.body.newIngredients.split(",");
        rawNewIngredients.forEach((newIngredient) => {
          const trimmedIngredient = newIngredient.trim();
          if (!uniqueIngredients.includes(trimmedIngredient)) {
            ingredientsList.push(trimmedIngredient);
          }
        });
      }

      if (req.body.description === "") {
        req.body.description = "No description available.";
      }

      const userId = res.locals.user ? res.locals.user._id : null;
      User.findById(userId)
        .sort({ createdAt: -1 })
        .then((result) => {
          const username = result.email

      const newRecipeInfo = {
        name: req.body.name,
        author: username,
        description: req.body.description,
        dishType: req.body.dishType,
        difficulty: req.body.difficulty,
        instructions: req.body.instructions,
        ingredients: ingredientsList,
      };

      const newRecipe = new Recipes(newRecipeInfo);
      newRecipe
        .save()
        .then((result) => {
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: "An error occurred while creating the recipe.",
          })
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "An error occurred while fetching existing recipes.",
      });
    });
});

// 404 page
server.use((req, res) => {
  res.status(404).render("404", {
    title: "404 Page",
  });
});

server.listen(3000, "localhost", () => {
  console.log("listening for requests on port 3000");
});
