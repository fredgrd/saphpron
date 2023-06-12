import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import RecipeService from '../../services/recipe.service';
import './step-modal.feature.css';

import FullscreenModal from '../../components/modal/fullscreen-modal.component';
import { RecipeStep } from '../../models/recipe.model';

const StepModal: React.FC<{
  recipeId: number;
  isVisible: boolean;
  onClose: () => void;
  add: (step: RecipeStep) => void;
}> = ({ recipeId, isVisible, onClose, add }) => {
  const [newDescription, setNewDescription] = useState<string>('');
  const [recipeService, _] = useState<RecipeService>(new RecipeService());
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'scroll';
      setNewDescription('');
      setLoading(false);
    }
  }, [isVisible]);

  const onRecipeStepAdd = async () => {
    if (loading || !newDescription.length) return;
    setLoading(true);

    const { step, error } = await recipeService.createRecipeStep({
      recipe_id: recipeId,
      description: newDescription,
    });

    if (error || !step) {
      setLoading(false);
      console.log('IngredientModal/onAdd error: Could not add ingredient');
      return;
    }

    setLoading(false);
    add(step);
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
              <div className="stepmodal">
                <div className="stepmodal__background" onClick={onClose} />
                <div className="stepmodal__container">
                  <textarea
                    className="stepmodal__input"
                    placeholder="Add a description of the next step"
                    value={newDescription}
                    onChange={(ev) => setNewDescription(ev.target.value)}
                  />
                  <button className="stepmodal__add" onClick={onRecipeStepAdd}>
                    💾
                  </button>
                </div>
              </div>
            </FullscreenModal>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StepModal;
