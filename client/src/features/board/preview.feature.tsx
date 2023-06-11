import React from 'react';
import './preview.feature.css';
import { Recipe } from '../../models/recipe.model';
import { useNavigate } from 'react-router-dom';

const Preview: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
  const navigate = useNavigate();
  return (
    <div className="preview" onClick={() => navigate(`/recipe/${recipe.id}`)}>
      <img className="preview__media" src={recipe.media_url} />
      <div className="preview__info">
        <span className="preview__info__name">{recipe.name}</span>
        <span className="preview__info__description">{recipe.description}</span>
      </div>
      <div className="preview__prep-time">{recipe.prep_time} min</div>
    </div>
  );
};

export default Preview;
