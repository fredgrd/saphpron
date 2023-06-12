export interface Recipe {
  id: number;
  name: string;
  description: string;
  prep_time: number;
  is_favourite: boolean;
  media_url: string;
}

export interface RecipeGroup {
  key: string;
  recipes: Recipe[];
}

export interface Ingredient {
  id: number;
  name: string;
}

export interface RecipeIngredient {
  id: number;
  ingredient_id: number;
  name: string;
  info: string;
}

export interface RecipeStep {
  id: number;
  description: string;
  is_important: boolean;
}
