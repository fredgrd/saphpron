import { createContext } from 'react';
import { User } from '../models/user.model';
import UserService from '../services/user.service';

export const UserContext = createContext<{
  user: User | undefined;
  service: UserService | undefined;
  update: (user: User | undefined) => void;
}>({ user: undefined, update: () => {}, service: undefined });
