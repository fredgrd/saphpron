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
