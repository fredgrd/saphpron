import { filterFavourite, sortName, sortTime } from './recipe.helper';
import { Recipe } from '../models/recipe.model';

const MOCK_RECIPES: Recipe[] = [
  {
    id: 1,
    name: 'First recipe',
    description: 'First recipe description',
    prep_time: 10,
    is_favourite: true,
    media_url: 'media',
  },
  {
    id: 2,
    name: 'First second recipe',
    description: 'First second recipe description',
    prep_time: 15,
    is_favourite: false,
    media_url: 'media',
  },
  {
    id: 3,
    name: 'Second first recipe',
    description: 'Second first recipe description',
    prep_time: 14,
    is_favourite: true,
    media_url: 'media',
  },
  {
    id: 4,
    name: 'Second second recipe',
    description: 'Second second recipe description',
    prep_time: 12,
    is_favourite: false,
    media_url: 'media',
  },
  {
    id: 5,
    name: 'Third first recipe',
    description: 'Third first recipe description',
    prep_time: 13,
    is_favourite: true,
    media_url: 'media',
  },
];

const MOCK_RECIPES_SORT_NAME_ASC = [
  {
    key: 'f',
    recipes: [
      {
        id: 1,
        name: 'First recipe',
        description: 'First recipe description',
        prep_time: 10,
        is_favourite: true,
        media_url: 'media',
      },
      {
        id: 2,
        name: 'First second recipe',
        description: 'First second recipe description',
        prep_time: 15,
        is_favourite: false,
        media_url: 'media',
      },
    ],
  },
  {
    key: 's',
    recipes: [
      {
        id: 3,
        name: 'Second first recipe',
        description: 'Second first recipe description',
        prep_time: 14,
        is_favourite: true,
        media_url: 'media',
      },
      {
        id: 4,
        name: 'Second second recipe',
        description: 'Second second recipe description',
        prep_time: 12,
        is_favourite: false,
        media_url: 'media',
      },
    ],
  },
  {
    key: 't',
    recipes: [
      {
        id: 5,
        name: 'Third first recipe',
        description: 'Third first recipe description',
        prep_time: 13,
        is_favourite: true,
        media_url: 'media',
      },
    ],
  },
];

const MOCK_RECIPES_SORT_NAME_DES = [
  {
    key: 't',
    recipes: [
      {
        id: 5,
        name: 'Third first recipe',
        description: 'Third first recipe description',
        prep_time: 13,
        is_favourite: true,
        media_url: 'media',
      },
    ],
  },
  {
    key: 's',
    recipes: [
      {
        id: 4,
        name: 'Second second recipe',
        description: 'Second second recipe description',
        prep_time: 12,
        is_favourite: false,
        media_url: 'media',
      },
      {
        id: 3,
        name: 'Second first recipe',
        description: 'Second first recipe description',
        prep_time: 14,
        is_favourite: true,
        media_url: 'media',
      },
    ],
  },
  {
    key: 'f',
    recipes: [
      {
        id: 2,
        name: 'First second recipe',
        description: 'First second recipe description',
        prep_time: 15,
        is_favourite: false,
        media_url: 'media',
      },
      {
        id: 1,
        name: 'First recipe',
        description: 'First recipe description',
        prep_time: 10,
        is_favourite: true,
        media_url: 'media',
      },
    ],
  },
];

const MOCK_RECIPES_SORT_TIME_ASC = [
  {
    key: 'f',
    recipes: [
      {
        id: 1,
        name: 'First recipe',
        description: 'First recipe description',
        prep_time: 10,
        is_favourite: true,
        media_url: 'media',
      },
      {
        id: 2,
        name: 'First second recipe',
        description: 'First second recipe description',
        prep_time: 15,
        is_favourite: false,
        media_url: 'media',
      },
    ],
  },
  {
    key: 's',
    recipes: [
      {
        id: 4,
        name: 'Second second recipe',
        description: 'Second second recipe description',
        prep_time: 12,
        is_favourite: false,
        media_url: 'media',
      },
      {
        id: 3,
        name: 'Second first recipe',
        description: 'Second first recipe description',
        prep_time: 14,
        is_favourite: true,
        media_url: 'media',
      },
    ],
  },
  {
    key: 't',
    recipes: [
      {
        id: 5,
        name: 'Third first recipe',
        description: 'Third first recipe description',
        prep_time: 13,
        is_favourite: true,
        media_url: 'media',
      },
    ],
  },
];

const MOCK_RECIPES_SORT_TIME_DES = [
  {
    key: 't',
    recipes: [
      {
        id: 5,
        name: 'Third first recipe',
        description: 'Third first recipe description',
        prep_time: 13,
        is_favourite: true,
        media_url: 'media',
      },
    ],
  },
  {
    key: 's',
    recipes: [
      {
        id: 3,
        name: 'Second first recipe',
        description: 'Second first recipe description',
        prep_time: 14,
        is_favourite: true,
        media_url: 'media',
      },
      {
        id: 4,
        name: 'Second second recipe',
        description: 'Second second recipe description',
        prep_time: 12,
        is_favourite: false,
        media_url: 'media',
      },
    ],
  },
  {
    key: 'f',
    recipes: [
      {
        id: 2,
        name: 'First second recipe',
        description: 'First second recipe description',
        prep_time: 15,
        is_favourite: false,
        media_url: 'media',
      },
      {
        id: 1,
        name: 'First recipe',
        description: 'First recipe description',
        prep_time: 10,
        is_favourite: true,
        media_url: 'media',
      },
    ],
  },
];

it('filters the recipes to show favourites', () => {
  const filtered = filterFavourite(MOCK_RECIPES, 'favourite');
  expect(filtered).toEqual(MOCK_RECIPES.filter((e) => e.is_favourite));
});

it('filters the recipes to show unfavourites', () => {
  const filtered = filterFavourite(MOCK_RECIPES, 'unfavourite');
  expect(filtered).toEqual(MOCK_RECIPES.filter((e) => !e.is_favourite));
});

it('filters the recipes to show all', () => {
  const filtered = filterFavourite(MOCK_RECIPES, 'all');
  expect(filtered).toEqual(MOCK_RECIPES);
});

it('sort the recipes in ascending order according to name', () => {
  const sorted = sortName(MOCK_RECIPES, 'ascending');
  expect(sorted).toEqual(MOCK_RECIPES_SORT_NAME_ASC);
});

it('sort the recipes in descending order according to name', () => {
  const sorted = sortName(MOCK_RECIPES, 'descending');
  expect(sorted).toEqual(MOCK_RECIPES_SORT_NAME_DES);
});

it('sort the recipes in ascending order according to time', () => {
  let sorted = sortName(MOCK_RECIPES, 'ascending');
  sorted = sortTime(sorted, 'ascending');
  expect(sorted).toEqual(MOCK_RECIPES_SORT_TIME_ASC);
});

it('sort the recipes in descending order according to time', () => {
  let sorted = sortName(MOCK_RECIPES, 'descending');
  sorted = sortTime(sorted, 'descending');
  expect(sorted).toEqual(MOCK_RECIPES_SORT_TIME_DES);
});
