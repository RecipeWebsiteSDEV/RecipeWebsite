const { MongoClient } = require("mongodb");
require('dotenv').config();

// Replace the uri string with your MongoDB deployment's connection string.
const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri);

// This is the function that adds data
async function run() {
  try {
    await client.connect();
    // database and collection code goes here
    const db = client.db("websiteDB");
    const coll = db.collection("users");
    // insert code goes here
    const docs = [
        {
            email: "mario@google.com",
            password: "test123"
        }
        /* {
            name: "Pan-Seared Steak",
            author: "Phil Jacobs",
            description: "Pan-fried, butter-basted steak",
            dishType: "Entree",
            difficulty: "Medium",
            instructions: "Heat pan very hot. Add oil to the pan. Cook the first side for about 2 min. Flip, wait 30 seconds and add butter, crushed garlic, thyme and rosemary. Once butter is melted, baste until finished cooking. Take off and allow it to rest.",
            ingredients: [
                "Steak",
                "Garlic",
                "Butter",
                "Neautral oil",
                "Rosemary",
                "Thyme",
                "Salt",
                "Pepper"
            ]
        },
        {
            name: "Vodka Pasta",
            author: "Tim Thompson",
            description: "Pan pasta with pink sauce",
            dishType: "Entree",
            difficulty: "Easy",
            instructions: "Boil and cook pasta. While boiling, saute garlic, green onion, and red chili flake in olive oil. When fragrant and translucent add tomato paste. Once tomato paste is fragrant and dry, cut off the heat and add heavy cream, cheese and a small amount of butter. Incorporate ingredients and taste for seasoning. When the sauce is good add pasta.",
            ingredients: [
                "Garlic", "Green onion", "Chili flake", "Tomato paste", "Heavy cream", "Parmesan cheese", "Butter", "Pasta", "Pasta water", "Salt", "Pepper"
            ]
        },
        {
            name: "Fried rice",
            author: "Paul Sores",
            description: "Fried rice dish made with leftover white rice",
            dishType: "Side",
            difficulty: "Easy",
            instructions: "* Heat wok (season). Oil in. When oil is smoking, put in garlic, shallot, white end of green onion, and chili flake. Add a significant amount of chili flake. Once browned and fragrant, season w salt and add egg. Once egg is almost fully scrambled, add rice. Mix well. Add soy sauce, sesame oil and white pepper to taste. Very small amounts of sesame oil and white pepper. Try best to spread around rice. Check for taste if more soy sauce is needed. Finish cooking till chosen doneness. Constantly check for taste. Cut heat, add green pepper, mix well",
            ingredients: [
                "Peanut oil",
                "Garlic",
                "Shallot",
                "Green onion",
                "Red pepper flake",
                "Egg",
                "Salt",
                "'Day old' rice",
                "Butter",
                "Soy sauce",
                "Sesame oil",
                "White pepper"
            ]
        },
        {
            name: "Pasta Aglio e Olio",
            author: "Tiny Tim",
            description: "Garlic pasta dish",
            dishType: "Entree",
            difficulty: "Medium",
            instructions: "Start pasta (cook al dente). Olive oil covering pan, not that thick. Heat until shimmering. Add in garlic and chili flake. Saute until browning. Off the heat. Add in pasta + pasta water. Mix thoroughly. Remove from heat. Continue to mix until sauce has formed. Season to taste with salt and pepper. Add chopped parsley (wait as long as possible to chop). Add lemon juice.",
            ingredients: [
                "Olive oil",
                "Garlic",
                "Red pepper flake",
                "Lemon",
                "Salt",
                "Pepper",
                "Parsley",
                "MSG",
                "Noodles",
                "Pasta water"
            ]
        },
        {
            name: "Pan-fried Salmon",
            author: "Kyle Brooks",
            description: "Salmon cooked and basted in a pan",
            dishType: "Entree",
            difficulty: "Medium",
            instructions: "Take out salmon, score if necessary, separate belly, temper. Heat pan pretty hot. Season salmon with salt and pepper. Oil in, salmon in skin side down (till about ¼-⅓ cooked at bottom). About 1 min before, add belly (flesh side down), flip at same time, pull belly after first baste or when done. Flip, drop heat to low, butter, and aromatics in, then herbs then baste. Try to time flesh side crust with internal temp. If the inside still needs to come up, flip again and finish basting on skin-side down. Finish till middle comes up to 105F. Pull, with butter, herbs, and aromatics covering (let come up to 110ish). Add lemon (SMALL).",
            ingredients: [
                "Salmon",
                "Peanut oil",
                "Butter",
                "Garlic",
                "Shallot",
                "Dill",
                "Thyme",
                "Lemon",
                "Salt",
                "Pepper"
            ]
        } */
    ];
    const result = await coll.insertMany(docs);
    // display the results of your operation
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);