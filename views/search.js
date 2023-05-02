function displayCheckedIngredients() {
    const commonIngredient1 = document.querySelector('input[name="ingredient1"]');
    const commonIngredient2 = document.querySelector('input[name="ingredient2"]');
    const commonIngredient3 = document.querySelector('input[name="ingredient3"]');
    const recipesDropdown = document.getElementById("recipes-dropdown")
    const recipes = recipesDropdown.querySelectorAll("button[class^='accordion-button collapsed-']")
    let selectedIngredients = [];

    if (commonIngredient1.checked) { selectedIngredients.push(commonIngredient1.value) };
    if (commonIngredient2.checked) { selectedIngredients.push(commonIngredient2.value) };
    if (commonIngredient3.checked) { selectedIngredients.push(commonIngredient3.value) };

    console.log(selectedIngredients)

    for (let i = 0; i < recipes.length; i++) {
        recipes[2].style.backgroundColor = "green";
    }
}