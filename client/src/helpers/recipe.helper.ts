import { Recipe, RecipeGroup } from '../models/recipe.model';

export const filterFavourite = (
  recipes: Recipe[],
  filter: string
): Recipe[] => {
  if (filter === 'favourite') {
    return recipes.filter((recipe) => recipe.is_favourite === true);
  } else if (filter === 'unfavourite') {
    return recipes.filter((recipe) => recipe.is_favourite === false);
  } else {
    return recipes;
  }
};

export const sortName = (recipes: Recipe[], filter: string): RecipeGroup[] => {
  if (filter === 'ascending' || filter === 'descending') {
    const sort = recipes.sort((a, b) => {
      if (a.name < b.name) {
        return filter === 'ascending' ? -1 : 1;
      }

      if (a.name > b.name) {
        return filter === 'ascending' ? 1 : -1;
      }

      return 0;
    });

    const dict: { [key: string]: Recipe[] } = {};
    for (const recipe of sort) {
      const initial = recipe.name.charAt(0).toLowerCase();
      if (dict[initial]) {
        dict[initial].push(recipe);
      } else {
        dict[initial] = [recipe];
      }
    }

    const groups: RecipeGroup[] = [];
    for (const key in dict) {
      groups.push({ key, recipes: dict[key] });
    }

    return groups;
  } else {
    return [{ key: 'none', recipes }];
  }
};

export const sortTime = (
  recipeGroups: RecipeGroup[],
  filter: string
): RecipeGroup[] => {
  if (filter === 'ascending' || filter === 'descending') {
    const sortedGroups: RecipeGroup[] = recipeGroups.map((group) => {
      const sorted = group.recipes.sort((a, b) =>
        filter === 'ascending'
          ? a.prep_time - b.prep_time
          : b.prep_time - a.prep_time
      );

      return { key: group.key, recipes: sorted };
    });

    return sortedGroups;
  } else {
    return recipeGroups;
  }
};
