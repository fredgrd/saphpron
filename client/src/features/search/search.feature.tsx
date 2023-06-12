import React, { useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Recipe } from '../../models/recipe.model';
import RecipeService from '../../services/recipe.service';
import './search.feature.css';

import FullscreenModal from '../../components/modal/fullscreen-modal.component';
import { ToastContext } from '../../context/tost.context';

import SeachStart from '../../assets/search-recipe.png';
import SearchFail from '../../assets/search-noresult.png';
import Spinner from '../../components/spinner/spinner.component';
import { useNavigate } from 'react-router-dom';

const Search: React.FC<{ isVisible: boolean; onClose: () => void }> = ({
  isVisible,
  onClose,
}) => {
  const [query, setQuery] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipesLoading, setRecipesLoading] = useState<boolean>(false);
  const [recipeService, _] = useState<RecipeService>(new RecipeService());
  const inputRef = useRef<HTMLInputElement>(null);
  const toastContext = useContext(ToastContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflowY = 'hidden';
      inputRef.current?.focus();
    } else {
      document.body.style.overflowY = 'scroll';
      setQuery('');
      setRecipes([]);
      setRecipesLoading(false);
    }
  }, [isVisible]);

  const onChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const currentQuery = ev.target.value;
    setQuery(currentQuery);

    if (!currentQuery.length) {
      return;
    }

    setRecipesLoading(true);

    // Query
    const searchQuery = 'q=' + currentQuery;
    const { recipes, error } = await recipeService.search('info', searchQuery);

    if (error) {
      toastContext.update({
        isVisible: true,
        message: `Error searching recipes: ${error}`,
      });
      setRecipesLoading(false);
      return;
    }

    if (!recipes) {
      toastContext.update({
        isVisible: true,
        message: 'Error searching recipes',
      });
      setRecipesLoading(false);
      return;
    }

    setRecipesLoading(false);
    setRecipes(recipes);
  };

  const RenderResults: React.FC = () => {
    if (!recipes.length && !query.length) {
      return (
        <div className="search__prompt">
          <img className="search__prompt__img" src={SeachStart} />
          <span className="search__prompt__test">
            Search for all your recipes 😋
          </span>
        </div>
      );
    }

    if (!recipes.length && recipesLoading) {
      return (
        <div className="search__prompt">
          <div style={{ width: '30px', height: '30px' }}>
            <Spinner />
          </div>
        </div>
      );
    }

    if (!recipes.length && !recipesLoading) {
      return (
        <div className="search__prompt">
          <img className="search__prompt__img" src={SearchFail} />
          <span className="search__prompt__test">No recipe found 🙁</span>
        </div>
      );
    }

    return (
      <div className="search__recipes">
        {recipes.map((recipe) => (
          <div
            className="search__recipe"
            key={recipe.id}
            onClick={() => {
              navigate(`/recipe/${recipe.id}`);
              onClose();
            }}
          >
            <img className="search__recipe__img" src={recipe.media_url} />
            <span className="search__recipe__name">{recipe.name}</span>
            <div className="search__recipe__prep-time">
              {recipe.prep_time} min
            </div>
          </div>
        ))}
      </div>
    );
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
              <div className="search">
                <div className="search__background" onClick={onClose} />
                <motion.input
                  className="search__input"
                  initial={{ width: '100px' }}
                  animate={{ width: '300px', maxWidth: '100%' }}
                  placeholder="Search"
                  ref={inputRef}
                  value={query}
                  onChange={onChange}
                />
                <div className="saerch__results">
                  <RenderResults />
                </div>
              </div>
            </FullscreenModal>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Search;
