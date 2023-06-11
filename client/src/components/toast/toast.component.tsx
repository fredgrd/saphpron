import React, { useContext, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastContext } from '../../context/tost.context';
import './toast.component.css';

const Toast: React.FC = () => {
  const toastContext = useContext(ToastContext);
  const state = toastContext.state;

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (state.isVisible) {
      timeout = setTimeout(() => {
        toastContext.update({ isVisible: false, message: '' });
      }, 4000);
    }

    return () => clearTimeout(timeout);
  }, [toastContext.state]);

  return (
    <AnimatePresence>
      {state.isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="toast">{state.message ? state.message : ''}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
