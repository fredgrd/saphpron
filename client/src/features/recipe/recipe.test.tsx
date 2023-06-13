import React from 'react';
import { render, screen } from '@testing-library/react';
import RecipeDetail from './recipe-detail.feature';

let container: HTMLElement;
beforeEach(() => {
  const renderedView = render(<RecipeDetail />);
  container = renderedView.container;
});

it('renders the RecipeDetail', () => {
  expect(container.getElementsByClassName('recipedetail').length).toBe(1);
  expect(container.getElementsByClassName('recipedetail__content').length).toBe(
    1
  );
});

it('renders the RecipeInfos', () => {
  expect(container.getElementsByClassName('recipeinfos').length).toBe(1);
  expect(container.getElementsByClassName('recipeinfos__header').length).toBe(
    1
  );
  expect(
    container.getElementsByClassName('recipeinfos__container').length
  ).toBe(1);

  expect(container.getElementsByClassName('recipeinfos__image').length).toBe(1);
  expect(
    container.getElementsByClassName('recipeinfos__image__preview').length
  ).toBe(1);
  expect(container.getElementsByClassName('recipeinfos__info').length).toBe(1);
});

it('renders the RecipeInfos inputs', () => {
  const nameLabel = screen.getByText('Name');
  expect(nameLabel).toBeInTheDocument();

  const nameInput = container.querySelector('#Name');
  expect(nameInput).toBeInTheDocument();

  const descriptionInput = container.querySelector('#Description');
  expect(descriptionInput).toBeInTheDocument();
});

it('renders the RecipeInfos CREATE', () => {
  const element = screen.getByRole('button', { name: 'CREATE' });
  expect(element).toBeInTheDocument();
});
