import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './recipe-detail.feature.css';
import {
  Recipe,
  RecipeIngredient,
  RecipeStep,
} from '../../models/recipe.model';
import Spinner from '../../components/spinner/spinner.component';
import RecipeService from '../../services/recipe.service';
import { ToastContext } from '../../context/tost.context';
import CreateRecipe from './create-recipe.feature';
import EditRecipe from './edit-recipe.feature';
import RecipeIngredientView from './recipe-ingredient.feature';
import { deepCopy } from '../../utils/memory';
import BigButton from '../../components/big-button/big-button.component';
import IngredientModal from './ingredient-modal.feature';
import RecipeStepView from './recipe-step.feature';
import StepModal from './step-modal.feature';

const RecipeDetail: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe>();
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [recipeService, _] = useState<RecipeService>(new RecipeService());
  const [showIngredientsModal, setShowIngredientsModal] =
    useState<boolean>(false);
  const [showStepModal, setShowStepModal] = useState<boolean>(false);
  const { id } = useParams();
  const toastContext = useContext(ToastContext);

  useEffect(() => {
    const fetch = async (id: string) => {
      const { result, error } = await recipeService.show(id);

      if (error) {
        toastContext.update({
          isVisible: true,
          message: `Error searching recipes: ${error}`,
        });
        setLoading(false);
        return;
      }

      if (!result) {
        toastContext.update({
          isVisible: true,
          message: 'Error searching recipes',
        });
        setLoading(false);
        return;
      }

      setRecipe(result.recipe);
      setIngredients(result.ingredients);
      setSteps(result.steps);

      console.log(result.ingredients, result.steps);
      setLoading(false);
    };

    if (id && id !== 'new') {
      fetch(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const updateIngredient = (ingredient: RecipeIngredient) => {
    const updateIngredients: RecipeIngredient[] = deepCopy(ingredients);
    const ingredientIndex = updateIngredients.findIndex(
      (el) => el.id === ingredient.id
    );

    if (ingredientIndex > -1) {
      updateIngredients[ingredientIndex] = ingredient;
      setIngredients(updateIngredients);
    }
  };

  const deleteIngredient = (id: number) => {
    const updateIngredients: RecipeIngredient[] = deepCopy(ingredients);
    const ingredientIndex = updateIngredients.findIndex((el) => el.id === id);

    if (ingredientIndex > -1) {
      updateIngredients.splice(ingredientIndex, 1);
      setIngredients(updateIngredients);
    }
  };

  const addRecipeIngredient = (ingredient: RecipeIngredient) => {
    const updateIngredients: RecipeIngredient[] = ingredients;
    updateIngredients.push(ingredient);
    setIngredients(updateIngredients);
  };

  const updateStep = (step: RecipeStep) => {
    const updateSteps: RecipeStep[] = deepCopy(steps);
    const stepIndex = updateSteps.findIndex((el) => el.id === step.id);

    if (stepIndex > -1) {
      updateSteps[stepIndex] = step;
      setSteps(updateSteps);
    }
  };

  const deleteStep = (id: number) => {
    const updateSteps: RecipeStep[] = deepCopy(steps);
    const stepIndex = updateSteps.findIndex((el) => el.id === id);

    if (stepIndex > -1) {
      updateSteps.splice(stepIndex, 1);
      setSteps(updateSteps);
    }
  };

  const addRecipeStep = (ingredient: RecipeStep) => {
    const updateSteps: RecipeStep[] = steps;
    updateSteps.push(ingredient);
    setSteps(updateSteps);
  };

  if (loading) {
    return (
      <div className="recipedetail">
        <div className="recipedetail__spinner-container">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="recipedetail">
      <div className="recipedetail__content">
        {recipe ? (
          <EditRecipe recipe={recipe} set={setRecipe} />
        ) : (
          <CreateRecipe set={setRecipe} />
        )}
        {recipe && (
          <div className="recipedetail__section">
            <div className="recipedetail__section__header">INGREDIENTS</div>
            {ingredients.length > 0 && (
              <div className="recipedetail__section-list">
                {ingredients.map((ingredient, index) => (
                  <RecipeIngredientView
                    ingredient={ingredient}
                    set={updateIngredient}
                    del={deleteIngredient}
                    key={ingredient.id}
                  />
                ))}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <BigButton
                title="ADD"
                isLoading={false}
                onClick={() => setShowIngredientsModal(true)}
              />
              <IngredientModal
                recipeId={recipe.id}
                isVisible={showIngredientsModal}
                onClose={() => setShowIngredientsModal(false)}
                add={addRecipeIngredient}
              />
            </div>
          </div>
        )}

        {recipe && (
          <div className="recipedetail__section">
            <div className="recipedetail__section__header">STEPS</div>
            {steps.length > 0 && (
              <div className="recipedetail__section-list">
                {steps.map((step, index) => (
                  <RecipeStepView
                    step={step}
                    set={updateStep}
                    del={deleteStep}
                    key={step.id}
                  />
                ))}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <BigButton
                title="ADD"
                isLoading={false}
                onClick={() => setShowStepModal(true)}
              />
              <StepModal
                recipeId={recipe.id}
                isVisible={showStepModal}
                onClose={() => setShowStepModal(false)}
                add={addRecipeStep}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
