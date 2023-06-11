import { Ingredient, Recipe } from '../models/recipe.model';
import ApiService from './api.service';

class RecipeService extends ApiService {
  async showAll(): Promise<{ recipes?: Recipe[]; error?: string }> {
    const { result, error } = await this.fetch<Recipe[]>('recipes', {
      method: 'GET',
    });

    if (error) {
      return { error };
    }

    if (!result) {
      return { error: 'No result from the server' };
    }

    return { recipes: result };
  }

  async showAllIngredients(): Promise<{
    ingredients?: Ingredient[];
    error?: string;
  }> {
    const { result, error } = await this.fetch<Ingredient[]>('ingredients', {
      method: 'GET',
    });

    if (error) {
      return { error };
    }

    if (!result) {
      return { error: 'No result from the server' };
    }

    return { ingredients: result };
  }

  async search(
    mode: 'info' | 'ingrs',
    query: string
  ): Promise<{ recipes?: Recipe[]; error?: string }> {
    const url = `recipes/search/${mode}/?${query}`;
    const { result, error } = await this.fetch<Recipe[]>(url, {
      method: 'GET',
    });

    if (error) {
      return { error };
    }

    if (!result) {
      return { error: 'No result from the server' };
    }

    return { recipes: result };
  }
}

export default RecipeService;
