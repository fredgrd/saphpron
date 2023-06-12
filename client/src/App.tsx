import React, { useEffect, useState } from 'react';
import UserService from './services/user.service';
import { User } from './models/user.model';
import './App.css';

import VisitorApp from './features/visitor-app/visitor-app.feature';
import Spinner from './components/spinner/spinner.component';
import { UserContext } from './context/user.context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContext } from './context/tost.context';
import { ToastState } from './models/toast.model';
import Toast from './components/toast/toast.component';
import Header from './components/header/header.component';
import Board from './features/board/board.feature';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [userService, _] = useState<UserService>(new UserService());
  const [user, setUser] = useState<User>();
  const [toastState, setToastState] = useState<ToastState>({
    isVisible: false,
    message: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { user, error } = await userService.user();

      if (error) {
        setLoading(false);
        console.log('App/user error');
      }

      if (!user) {
        setLoading(false);
        console.log('App/user error:', 'No User');
      }

      setLoading(false);
      setUser(user);
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="app__loading">
        <div className="app__loading__spinner-container">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        user: user,
        service: userService,
        update: (user) => setUser(user),
      }}
    >
      <ToastContext.Provider
        value={{ state: toastState, update: (state) => setToastState(state) }}
      >
        {user ? (
          <BrowserRouter>
            <Header />
            <div className="app">
              <Routes>
                <Route path="/" element={<Board />} />
              </Routes>
            </div>
          </BrowserRouter>
        ) : (
          <VisitorApp />
        )}
        <Toast />
      </ToastContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
