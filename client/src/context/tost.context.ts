import { createContext } from 'react';
import { ToastState } from '../models/toast.model';

export const ToastContext = createContext<{
  state: ToastState;
  update: (state: ToastState) => void;
}>({ state: { isVisible: false, message: '' }, update: () => {} });
