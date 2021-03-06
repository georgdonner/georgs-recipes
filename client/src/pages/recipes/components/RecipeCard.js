import React from 'react';
import { Link } from 'react-router-dom';
import { recipe as recipePropType } from '../../../utils/propTypes';

import './RecipeCard.scss';

const responsiveImg = (recipe) => {
  const imgUrl = (width) => recipe.image.replace(/\d+.jpg/, `${width}.jpg`);

  return recipe.image ? (
    <img
      srcSet={`${imgUrl(1600)} 1600w,
      ${imgUrl(1000)} 1000w,
      ${imgUrl(800)} 800w,
      ${imgUrl(400)} 400w`}
      sizes="(min-width: 1200px) 400px,
      (min-width: 600px) 50vw,
      100vw"
      src={imgUrl(800)}
      alt={recipe.title}
      crossOrigin="anonymous"
    />
  ) : (
    <img src="img/comingsoon.jpg" alt="Bild kommt bald" />
  );
};

const RecipeCard = ({ recipe }) => {
  const vegetarian = recipe.categories.includes('Vegetarisch');
  const vegan = recipe.categories.includes('Vegan');
  const filteredCtg = recipe.categories
    .filter((ctg) => ctg !== 'Vegan' && ctg !== 'Vegetarisch');

  return (
    <Link
      className="recipe-card" id={recipe._id}
      to={{
        pathname: `/recipe/${recipe._id}`,
        state: { fromHome: true },
      }}
    >
      {responsiveImg(recipe)}
      <h2>
        {vegetarian || vegan
          ? <span className={vegan ? 'vegan' : 'vegetarian'}>{recipe.title}</span>
          : recipe.title}
      </h2>
      {filteredCtg.length > 0
        ? <footer>{filteredCtg.map((ctg) => <span key={ctg}>{ctg}</span>)}</footer>
        : null}
    </Link>
  );
};

RecipeCard.propTypes = {
  recipe: recipePropType.isRequired,
};

export default RecipeCard;
