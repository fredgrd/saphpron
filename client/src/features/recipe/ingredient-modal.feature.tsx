import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './ingredient-modal.feature.css';

import FullscreenModal from '../../components/modal/fullscreen-modal.component';
import SimpleInput from '../../components/simple-input/simple-input.component';
import { Ingredient, RecipeIngredient } from '../../models/recipe.model';
import RecipeService from '../../services/recipe.service';
import SmallButton from '../../components/small-button/small-button.component';

const IngredientModal: React.FC<{
  recipeId: number;
  isVisible: boolean;
  onClose: () => void;
  add: (ingredieng: RecipeIngredient) => void;
}> = ({ recipeId, isVisible, onClose, add }) => {
  const [newIngredientName, setNewIngredientName] = useState<string>('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient>();
  const [selectedInfo, setSelectedInfo] = useState<string>('');
  const [recipeService, _] = useState<RecipeService>(new RecipeService());
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      const { ingredients, error } = await recipeService.showAllIngredients();

      if (error || !ingredients) {
        console.log(
          'IngredientModal/useEffect error: Could not fetch ingredients'
        );
        return;
      }

      setIngredients(ingredients);
    };

    fetch();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'scroll';
      setNewIngredientName('');
      setSelectedInfo('');
      setSelectedIngredient(undefined);
      setLoading(false);
    }
  }, [isVisible]);

  const onIngredientAdd = async () => {
    if (loading) return;
    setLoading(true);

    const { ingredient, error } = await recipeService.createIngredient(
      newIngredientName
    );

    if (error || !ingredient) {
      console.log('IngredientModal/onAdd error: Could not add ingredient');
      return;
    }

    setNewIngredientName('');
    const updateIngredients = ingredients;
    updateIngredients.push(ingredient);
    setIngredients(updateIngredients);
  };

  const onRecipeIngredientAdd = async () => {
    if (loading || !selectedIngredient) return;
    setLoading(true);

    const { ingredient, error } = await recipeService.createRecipeIngredient({
      recipe_id: recipeId,
      ingredient_id: selectedIngredient.id,
      info: selectedInfo,
    });

    if (error || !ingredient) {
      console.log('IngredientModal/onAdd error: Could not add ingredient');
      return;
    }

    ingredient.name = selectedIngredient.name;
    setLoading(false);
    add(ingredient);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0,
              },
            }}
          >
            <FullscreenModal>
              <div className="ingredientmodal">
                <div
                  className="ingredientmodal__background"
                  onClick={onClose}
                />
                <div className="ingredientmodal__container">
                  <div className="ingredientmodal__ingredients">
                    <div className="ingredientmodal__ingredients__new">
                      <SimpleInput
                        value={newIngredientName}
                        onChange={setNewIngredientName}
                        options={{ placeholder: 'Add a new ingredient' }}
                      />
                      <button
                        className="ingredientmodal__ingredients__new__btn"
                        onClick={onIngredientAdd}
                      >
                        💾
                      </button>
                    </div>
                    <div className="ingredientmodal__ingredients-list">
                      {ingredients.map((ingredient) => (
                        <div style={{ height: '28px' }} key={ingredient.id}>
                          <SmallButton
                            title={ingredient.name}
                            isSelected={
                              selectedIngredient !== undefined &&
                              selectedIngredient.id === ingredient.id
                            }
                            onClick={() => setSelectedIngredient(ingredient)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedIngredient && (
                    <div className="ingredientmodal__recipe-ingredient">
                      <div className="ingredientmodal__recipe-ingredient__name">
                        {selectedIngredient.name}
                      </div>
                      <SimpleInput
                        value={selectedInfo}
                        onChange={setSelectedInfo}
                        options={{ placeholder: 'Add quantity' }}
                      />
                      <button
                        className="ingredientmodal__ingredients__new__btn"
                        onClick={onRecipeIngredientAdd}
                      >
                        ➕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </FullscreenModal>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IngredientModal;
