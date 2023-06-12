import React, { useContext, useState } from 'react';
import { RecipeIngredient } from '../../models/recipe.model';
import './recipe-ingredient.feature.css';

import RecipeService from '../../services/recipe.service';
import { ToastContext } from '../../context/tost.context';

const RecipeIngredientView: React.FC<{
  ingredient: RecipeIngredient;
  set: (ingredient: RecipeIngredient) => void;
  del: (id: number) => void;
}> = ({ ingredient, set, del }) => {
  const [infoEdit, setInfoEdit] = useState<string>(ingredient.info);
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [recipeService, _] = useState<RecipeService>(new RecipeService());
  const toastContext = useContext(ToastContext);

  const onUpdate = async () => {
    if (loading || !infoEdit.length) return;

    const { success, error } = await recipeService.updateRecipeIngredient(
      ingredient.id,
      infoEdit
    );

    if (error) {
      setLoading(false);
      toastContext.update({
        isVisible: true,
        message: `Error updating ingredient: ${error}`,
      });
      return;
    }

    setLoading(false);
    setEditing(false);
    set({
      ...ingredient,
      info: infoEdit,
    });
    setInfoEdit('');
  };

  const onDelete = async () => {
    if (loading || !infoEdit.length) return;

    const { success, error } = await recipeService.deleteRecipeIngredient(
      ingredient.id
    );

    if (error) {
      setLoading(false);
      toastContext.update({
        isVisible: true,
        message: `Error deleting ingredient: ${error}`,
      });
      return;
    }

    setLoading(false);
    setEditing(false);
    del(ingredient.id);
    setInfoEdit('');
  };

  return (
    <div className="recipeingredient">
      <span className="recipeingredient__name">✔ {ingredient.name}</span>
      <span className="recipeingredient__info">{ingredient.info}</span>
      <button
        className="recipeingredient__edit"
        onClick={() => setEditing(true)}
      >
        ✍️
      </button>

      {editing && (
        <div className="recipeingredient__editor">
          <input
            className="recipeingredient__editor__input"
            value={infoEdit}
            onChange={(ev) => setInfoEdit(ev.target.value)}
          />
          <button className="recipeingredient__editor__btn" onClick={onUpdate}>
            💾
          </button>
          <button className="recipeingredient__editor__btn" onClick={onDelete}>❌</button>
          <button
            className="recipeingredient__editor__btn"
            onClick={() => setEditing(false)}
          >
            👉
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeIngredientView;
