import React from 'react';
import { render, screen } from '@testing-library/react';
import VisitorApp from './visitor-app.feature';
import { act } from 'react-dom/test-utils';

let container: HTMLElement;
beforeEach(() => {
  const renderedView = render(<VisitorApp />);
  container = renderedView.container;
});

it('renders the VisitorApp', () => {
  expect(container.getElementsByClassName('visitorapp').length).toBe(1);
  expect(
    container.getElementsByClassName('visitorapp__card__container').length
  ).toBe(1);
  expect(
    container.getElementsByClassName('visitorapp__mode-selector').length
  ).toBe(1);
  expect(container.getElementsByClassName('visitorapp__card').length).toBe(1);
  expect(container.getElementsByClassName('visitorapp__logo').length).toBe(1);
});

it('renders the AuthMode Buttons', () => {
  const signInButton = screen.getByRole('button', { name: 'SIGN IN' });
  expect(signInButton).toBeInTheDocument();

  const signUpButton = screen.getByRole('button', { name: 'SIGN UP' });
  expect(signUpButton).toBeInTheDocument();
});

it('renders the SigninFeature', () => {
  // TEST SIGNIN
  expect(container.getElementsByClassName('signinfeature').length).toBe(1);
  expect(container.getElementsByClassName('signupfeature').length).toBe(0);
});

it('handles the Signin Inputs interactions', () => {
  // Signin Inputs
  const signinEmailInput = screen.getByPlaceholderText('EMAIL');
  expect(signinEmailInput).toBeInTheDocument();

  act(() => {
    signinEmailInput.focus();
    signinEmailInput.blur();
  });

  const signinEmailErrorMessage = screen.getByText(
    'Please insert a valid email address'
  );
  expect(signinEmailErrorMessage).toBeInTheDocument();

  const signinPasswordInput = screen.getByPlaceholderText('PASSWORD');
  expect(signinPasswordInput).toBeInTheDocument();

  act(() => {
    signinPasswordInput.focus();
    signinPasswordInput.blur();
  });

  const signinPasswordErrorMessage = screen.getByText(
    'Please add a password with at least 5 characters'
  );
  expect(signinPasswordErrorMessage).toBeInTheDocument();
});

it('renderes the SignupFeature', () => {
  const signUpButton = screen.getByRole('button', { name: 'SIGN UP' });
  expect(signUpButton).toBeInTheDocument();

  // TEST SIGNUP
  act(() => {
    signUpButton.click();
  });
  expect(container.getElementsByClassName('signinfeature').length).toBe(0);
  expect(container.getElementsByClassName('signupfeature').length).toBe(1);
});

it('handles the Signin Inputs interactions', () => {
  const signUpButton = screen.getByRole('button', { name: 'SIGN UP' });
  expect(signUpButton).toBeInTheDocument();

  act(() => {
    signUpButton.click();
  });

  // Signin Inputs
  const signoutNameInput = screen.getByPlaceholderText('NAME');
  expect(signoutNameInput).toBeInTheDocument();

  act(() => {
    signoutNameInput.focus();
    signoutNameInput.blur();
  });

  const signoutNameErrorMessage = screen.getByText(
    'Please insert a valid name'
  );
  expect(signoutNameErrorMessage).toBeInTheDocument();

  const signoutEmailInput = screen.getByPlaceholderText('EMAIL');
  expect(signoutEmailInput).toBeInTheDocument();

  act(() => {
    signoutEmailInput.focus();
    signoutEmailInput.blur();
  });

  const signoutEmailErrorMessage = screen.getByText(
    'Please insert a valid email address'
  );
  expect(signoutEmailErrorMessage).toBeInTheDocument();

  const signoutPasswordInput = screen.getByPlaceholderText('PASSWORD');
  expect(signoutPasswordInput).toBeInTheDocument();

  act(() => {
    signoutPasswordInput.focus();
    signoutPasswordInput.blur();
  });

  const signoutPasswordErrorMessage = screen.getByText(
    'Please add a password with at least 5 characters'
  );
  expect(signoutPasswordErrorMessage).toBeInTheDocument();
});
