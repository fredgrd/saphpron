import React, { useContext, useState } from 'react';
import { RecipeStep } from '../../models/recipe.model';
import './recipe-step.feature.css';

import RecipeService from '../../services/recipe.service';
import { ToastContext } from '../../context/tost.context';

const RecipeStepView: React.FC<{
  step: RecipeStep;
  set: (step: RecipeStep) => void;
  del: (id: number) => void;
}> = ({ step, set, del }) => {
  const [descriptionEdit, setDescriptionEdit] = useState<string>(
    step.description
  );
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [recipeService, _] = useState<RecipeService>(new RecipeService());
  const toastContext = useContext(ToastContext);

  const onUpdate = async () => {
    if (loading || !descriptionEdit.length) return;

    const { step: updatedStep, error } = await recipeService.updateRecipeStep(
      step.id,
      descriptionEdit
    );

    if (error) {
      setLoading(false);
      toastContext.update({
        isVisible: true,
        message: `Error updating step: ${error}`,
      });
      return;
    }

    if (!updatedStep) {
      setLoading(false);
      toastContext.update({
        isVisible: true,
        message: 'Error updating step',
      });
      return;
    }

    setLoading(false);
    setEditing(false);
    set(updatedStep);
    setDescriptionEdit('');
  };

  const onDelete = async () => {
    if (loading || !descriptionEdit.length) return;

    const { success, error } = await recipeService.deleteRecipeStep(step.id);

    if (error) {
      setLoading(false);
      toastContext.update({
        isVisible: true,
        message: `Error deleting step: ${error}`,
      });
      return;
    }

    if (!success) {
      setLoading(false);
      toastContext.update({
        isVisible: true,
        message: 'Error deleting step',
      });
      return;
    }

    setLoading(false);
    setEditing(false);
    del(step.id);
    setDescriptionEdit('');
  };

  return (
    <div className="recipeingredient">
      <span className="recipeingredient__name">✔ {step.description}</span>
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
            value={descriptionEdit}
            onChange={(ev) => setDescriptionEdit(ev.target.value)}
          />
          <button className="recipeingredient__editor__btn" onClick={onUpdate}>
            💾
          </button>
          <button className="recipeingredient__editor__btn" onClick={onDelete}>
            ❌
          </button>
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

export default RecipeStepView;
