import React from 'react';
import { render, screen } from '@testing-library/react';
import Board from './board.feature';

let container: HTMLElement;
beforeEach(() => {
  const renderedView = render(<Board />);
  container = renderedView.container;
});

it('renders the Board', () => {
  expect(container.getElementsByClassName('board').length).toBe(1);
  expect(container.getElementsByClassName('board__container').length).toBe(1);

  expect(container.getElementsByClassName('board__filters').length).toBe(1);
  expect(
    container.getElementsByClassName('board__filters__section').length
  ).toBe(3);
  expect(
    container.getElementsByClassName('board__filters__section__buttons').length
  ).toBe(3);

  expect(
    container.getElementsByClassName('smallbutton').length
  ).toBe(9);
});
