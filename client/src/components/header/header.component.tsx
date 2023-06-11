import React, { useContext, useRef, useState } from 'react';
import { UserContext } from '../../context/user.context';
import './header.component.css';

import Logo from '../../assets/logo.png';
import { ReactComponent as ArrowDown } from '../../assets/arrow-down.svg';
import { ToastContext } from '../../context/tost.context';
import useClickOutside from '../../utils/useClickOutside';

const Header: React.FC = () => {
  const userContext = useContext(UserContext);
  const toastContext = useContext(ToastContext);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setShowUserDropdown(false));

  const onSignout = async () => {
    const userService = userContext.service;
    const updateUser = userContext.update;

    console.log('SIGNIN OUT');

    if (!userService) return;

    const { success, error } = await userService.signout();

    if (error) {
      console.log(error);
      toastContext.update({
        isVisible: true,
        message: `There has been an error signin out in: ${error}`,
      });
      return;
    }

    if (!success) {
      toastContext.update({
        isVisible: true,
        message: 'There has been an error signin out',
      });
      return;
    }

    updateUser(undefined);
  };

  return (
    <div className="header">
      <img className="header__logo" src={Logo} />
      <button className="header__search">
        <span className="header__search__title">Search</span>
      </button>
      <div className="header__user" ref={dropdownRef}>
        <button
          className="header__user__button"
          onClick={() => setShowUserDropdown((state) => !state)}
        >
          {userContext.user?.name}
          <ArrowDown
            fill="#1A1A1A"
            style={{
              transform: showUserDropdown ? 'rotate(180deg)' : undefined,
            }}
          />
        </button>
        {showUserDropdown && (
          <div className="header__user__dropdown">
            <span className="header__user__dropdown__email">
              {userContext.user?.email}
            </span>
            <button
              className="header__user__dropdown__signout"
              onClick={onSignout}
            >
              SIGN OUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
