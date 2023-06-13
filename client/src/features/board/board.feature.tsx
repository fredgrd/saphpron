import React, { useContext, useEffect, useState } from 'react';
import './board.feature.css';
import { Ingredient, Recipe, RecipeGroup } from '../../models/recipe.model';
import RecipeService from '../../services/recipe.service';
import { ToastContext } from '../../context/tost.context';
import {
  filterFavourite,
  sortName,
  sortTime,
} from '../../helpers/recipe.helper';
import SmallButton from '../../components/small-button/small-button.component';
import BigButton from '../../components/big-button/big-button.component';
import { deepCopy } from '../../utils/memory';
import Preview from './preview.feature';
import { useNavigate } from 'react-router-dom';

interface BoardFilters {
  favourite: 'favourite' | 'unfavourite' | 'all';
  name: 'ascending' | 'descending' | 'none';
  time: 'ascending' | 'descending' | 'none';
}

const Board: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [filtered, setFiltered] = useState<Recipe[]>([]);
  const [filters, setFilters] = useState<BoardFilters>({
    favourite: 'all',
    name: 'ascending',
    time: 'ascending',
  });
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(
    []
  );
  const [ingredientsLoading, setIngredientsLoading] = useState<boolean>(false);
  const [recipeService, _] = useState<RecipeService>(new RecipeService());
  const toastContext = useContext(ToastContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
    fetchIngredients();
  }, []);

  useEffect(() => {
    console.log(selectedIngredients);
  }, [selectedIngredients]);

  useEffect(() => {
    filterRecipes();
  }, [filters, recipes]);

  const fetchRecipes = async () => {
    const { recipes, error } = await recipeService.showAll();

    if (error) {
      toastContext.update({
        isVisible: true,
        message: `Error fetching recipes: ${error}`,
      });
      return;
    }

    if (!recipes) {
      toastContext.update({
        isVisible: true,
        message: 'Error fetching recipes',
      });
      return;
    }

    setRecipes(recipes);
  };

  const fetchIngredients = async () => {
    const { ingredients, error } = await recipeService.showAllIngredients();

    if (error) {
      toastContext.update({
        isVisible: true,
        message: `Error fetching ingredients: ${error}`,
      });
      return;
    }

    if (!ingredients) {
      toastContext.update({
        isVisible: true,
        message: 'Error fetching ingredients',
      });
      return;
    }

    console.log(ingredients);
    setIngredients(ingredients);
  };

  const filterRecipes = () => {
    const favs: Recipe[] = filterFavourite(recipes, filters.favourite);
    let groups = sortName(favs, filters.name);
    console.log('FILTERED BY NAME', groups);
    groups = sortTime(groups, filters.time);
    console.log('FILTERED BY TIME', groups);

    const flat = groups.flatMap((group) => group.recipes);

    console.log('FLAT', flat);

    setFiltered(flat);
  };

  const onIngredientClick = (ingredient: Ingredient) => {
    console.log(selectedIngredients);
    const ingredientIndex = selectedIngredients.findIndex(
      (e) => e.id === ingredient.id
    );

    if (ingredientIndex > -1) {
      const update: Ingredient[] = deepCopy(selectedIngredients);
      update.splice(ingredientIndex, 1);
      setSelectedIngredients(update);
    } else {
      const update: Ingredient[] = deepCopy(selectedIngredients);
      update.push(ingredient);
      setSelectedIngredients(update);
    }
  };

  const onApplyIngredients = async () => {
    setIngredientsLoading(true);

    if (ingredientsLoading) return;

    if (!selectedIngredients.length) {
      await fetchRecipes();
      setIngredientsLoading(false);
      return;
    }

    const query: string = selectedIngredients.reduce((prev, curr) => {
      const name = curr.name.replace(' ', '+');
      return prev + `${prev.length > 0 ? '&' : ''}q[]=${name}`;
    }, '');

    const { recipes, error } = await recipeService.search('ingrs', query);

    if (error) {
      toastContext.update({
        isVisible: true,
        message: `Error fetching recipes by ingredients: ${error}`,
      });
      setIngredientsLoading(false);
      return;
    }

    if (!recipes) {
      toastContext.update({
        isVisible: true,
        message: 'Error fetching recipes by ingredients',
      });
      setIngredientsLoading(false);
      return;
    }

    setIngredientsLoading(false);
    setRecipes(recipes);
  };

  return (
    <div className="board">
      <div className="board__container">
        <button
          className="board__recipe-new"
          onClick={() => navigate('/recipe/new')}
        >
          📝
        </button>
        <div className="board__filters">
          <div className="board__filters__section">
            <span>FAVOURITES</span>
            <div className="board__filters__section__buttons">
              <SmallButton
                title="FAVS"
                onClick={() =>
                  setFilters((state) => ({ ...state, favourite: 'favourite' }))
                }
                isSelected={filters.favourite === 'favourite'}
                options={{ selectedColor: '#F7BCC7' }}
              />
              <SmallButton
                title="UNFAVS"
                onClick={() =>
                  setFilters((state) => ({
                    ...state,
                    favourite: 'unfavourite',
                  }))
                }
                isSelected={filters.favourite === 'unfavourite'}
                options={{ selectedColor: '#EFF8FE' }}
              />
              <SmallButton
                title="ALL"
                onClick={() =>
                  setFilters((state) => ({ ...state, favourite: 'all' }))
                }
                isSelected={filters.favourite === 'all'}
                options={{ selectedColor: '#59AC69' }}
              />
            </div>
          </div>

          <div className="board__filters__section">
            <span>NAME</span>
            <div className="board__filters__section__buttons">
              <SmallButton
                title="SORT: A - Z"
                onClick={() =>
                  setFilters((state) => ({ ...state, name: 'ascending' }))
                }
                isSelected={filters.name === 'ascending'}
                options={{ selectedColor: '#FF5C4C' }}
              />
              <SmallButton
                title="SORT: Z - A"
                onClick={() =>
                  setFilters((state) => ({ ...state, name: 'descending' }))
                }
                isSelected={filters.name === 'descending'}
                options={{ selectedColor: '#659DC6' }}
              />
              <SmallButton
                title="NONE"
                onClick={() =>
                  setFilters((state) => ({ ...state, name: 'none' }))
                }
                isSelected={filters.name === 'none'}
                options={{ selectedColor: '#80449A' }}
              />
            </div>
          </div>

          <div className="board__filters__section">
            <span>PREPARATION TIME</span>
            <div className="board__filters__section__buttons">
              <SmallButton
                title="SORT: LOW - HIGH"
                onClick={() =>
                  setFilters((state) => ({ ...state, time: 'ascending' }))
                }
                isSelected={filters.time === 'ascending'}
                options={{ selectedColor: '#BDE0FE' }}
              />
              <SmallButton
                title="SORT: HIGH - LOW"
                onClick={() =>
                  setFilters((state) => ({ ...state, time: 'descending' }))
                }
                isSelected={filters.time === 'descending'}
                options={{ selectedColor: '#DCC6AE' }}
              />
              <SmallButton
                title="NONE"
                onClick={() =>
                  setFilters((state) => ({ ...state, time: 'none' }))
                }
                isSelected={filters.time === 'none'}
                options={{ selectedColor: '#FDD05E' }}
              />
            </div>
          </div>

          {ingredients.length > 0 && (
            <div className="board__filters__ingredients">
              <div className="board__filters__ingredients__header">
                <span>INGREDIENTS</span>
              </div>

              <div className="board__filters__ingredients__list">
                {ingredients.map((ingredient) => (
                  <SmallButton
                    title={ingredient.name}
                    key={ingredient.id}
                    onClick={() => onIngredientClick(ingredient)}
                    isSelected={
                      selectedIngredients.findIndex(
                        (e) => e.id === ingredient.id
                      ) > -1
                    }
                  />
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <BigButton
                  title="APPLY"
                  onClick={onApplyIngredients}
                  isLoading={ingredientsLoading}
                />
              </div>
            </div>
          )}
        </div>

        <div className="board__previews">
          {filtered.map((recipe) => (
            <Preview recipe={recipe} key={recipe.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
