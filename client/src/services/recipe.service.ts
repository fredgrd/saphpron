import {
  Ingredient,
  Recipe,
  RecipeIngredient,
  RecipeStep,
} from '../models/recipe.model';
import ApiService from './api.service';

interface ShowResult {
  recipe: Recipe;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

class RecipeService extends ApiService {
  // --------------------------------------------------------------------
  // RECIPES Methods
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

  // --------------------------------------------------------------------
  // SINGLE RECIPE Methods
  async show(recipeId: string): Promise<{
    result?: ShowResult;
    error?: string;
  }> {
    const { result, error } = await this.fetch<ShowResult>(
      `recipes/${recipeId}`,
      {
        method: 'GET',
      }
    );

    if (error) {
      return { error };
    }

    if (!result) {
      return { error: 'No result from the server' };
    }

    return { result };
  }

  async create(input: {
    name: string;
    description?: string;
    prep_time: number;
    media_url?: string;
  }): Promise<{ recipe?: Recipe; error?: string }> {
    const { result, error } = await this.fetch<Recipe>('recipes', {
      method: 'POST',
      body: {
        ...input,
      },
    });

    if (error) {
      return { error };
    }

    if (!result) {
      return { error: 'No result from the server' };
    }

    return { recipe: result };
  }

  async update(
    recipeId: number,
    input: {
      name?: string;
      description?: string;
      prep_time?: number;
      media_url?: string;
      is_favourite?: boolean;
    }
  ): Promise<{ recipe?: Recipe; error?: string }> {
    const { result, error } = await this.fetch<Recipe>(`recipes/${recipeId}`, {
      method: 'PATCH',
      body: {
        ...input,
      },
    });

    if (error) {
      return { error };
    }

    if (!result) {
      return { error: 'No result from the server' };
    }

    return { recipe: result };
  }

  // --------------------------------------------------------------------
  // INGREDIENTS Methods
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

  async createIngredient(
    name: string
  ): Promise<{ ingredient?: Ingredient; error?: string }> {
    const { result, error } = await this.fetch<Ingredient>('ingredients', {
      method: 'POST',
      body: {
        name,
      },
    });

    if (error) {
      return { error };
    }

    if (!result) {
      return { error: 'No result from the server' };
    }

    return { ingredient: result };
  }

  async createRecipeIngredient(input: {
    recipe_id: number;
    ingredient_id: number;
    info?: string;
  }): Promise<{
    ingredient?: RecipeIngredient;
    error?: string;
  }> {
    const { result, error } = await this.fetch<RecipeIngredient>(
      'recipes/ingredient',
      {
        method: 'POST',
        body: {
          ...input,
        },
      }
    );

    if (error) {
      return { error };
    }

    if (!result) {
      return { error: 'No result from the server' };
    }

    return { ingredient: result };
  }

  async updateRecipeIngredient(
    ingredientId: number,
    info: string
  ): Promise<{ success: boolean; error?: string }> {
    const { success, error } = await this.simpleFetch(
      `recipes/ingredient/${ingredientId}`,
      {
        method: 'PATCH',
        body: {
          info,
        },
      }
    );

    return { success, error };
  }

  async deleteRecipeIngredient(
    ingredientId: number
  ): Promise<{ success: boolean; error?: string }> {
    const { success, error } = await this.simpleFetch(
      `recipes/ingredient/${ingredientId}`,
      {
        method: 'DELETE',
      }
    );

    return { success, error };
  }

  // --------------------------------------------------------------------
  // STEPS Methods

  async createRecipeStep(input: {
    recipe_id: number;
    description: string;
  }): Promise<{
    step?: RecipeStep;
    error?: string;
  }> {
    const { result, error } = await this.fetch<RecipeStep>(
      'recipes/step',
      {
        method: 'POST',
        body: {
          ...input,
        },
      }
    );

    if (error) {
      return { error };
    }

    if (!result) {
      return { error: 'No result from the server' };
    }

    return { step: result };
  }

  async updateRecipeStep(
    stepId: number,
    description: string
  ): Promise<{ step?: RecipeStep; error?: string }> {
    const { result, error } = await this.fetch<RecipeStep>(
      `recipes/step/${stepId}`,
      {
        method: 'PATCH',
        body: {
          description,
        },
      }
    );

    if (error) {
      return { error };
    }

    if (!result) {
      return { error: 'No result from the server' };
    }

    return { step: result };
  }

  async deleteRecipeStep(
    stepId: number
  ): Promise<{ success: boolean; error?: string }> {
    const { success, error } = await this.simpleFetch(
      `recipes/step/${stepId}`,
      {
        method: 'DELETE',
      }
    );

    return { success, error };
  }
}

export default RecipeService;
