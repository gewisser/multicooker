export function splitIngredients(ingredients: string) {
  return ingredients.split(',').map((ingredient) => {
    return ingredient.trim();
  });
}
