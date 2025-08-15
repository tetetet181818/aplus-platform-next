"use client";
import { useState, useEffect } from "react";

const TOAST_LIMIT = 1;

let count = 0;
function generateId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastStore = {
  state: {
    toasts: [],
  },
  listeners: [],

  getState: () => toastStore.state,

  setState: (nextState) => {
    const newState =
      typeof nextState === "function"
        ? nextState(toastStore.state)
        : { ...toastStore.state, ...nextState };

    if (toastStore.state !== newState) {
      toastStore.state = newState;
      toastStore.listeners.forEach((listener) => listener());
    }
  },

  subscribe: (listener) => {
    toastStore.listeners.push(listener);
    return () => {
      const index = toastStore.listeners.indexOf(listener);
      if (index > -1) {
        toastStore.listeners.splice(index, 1);
      }
    };
  },
};

export const toast = ({ ...props }) => {
  const id = generateId();

  const update = (props) => {
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, ...props } : t)),
    }));
  };

  const dismiss = () => {
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  };

  toastStore.setState((state) => {
    const existingToastIndex = state.toasts.findIndex((t) => t.id === id);
    if (existingToastIndex > -1) {
      // Toast already exists, update it instead of adding new one
      return {
        ...state,
        toasts: state.toasts.map((t, index) =>
          index === existingToastIndex ? { ...t, ...props, id, dismiss } : t
        ),
      };
    }

    return {
      ...state,
      toasts: [{ ...props, id, dismiss }, ...state.toasts].slice(
        0,
        TOAST_LIMIT
      ),
    };
  });

  return {
    id,
    dismiss,
    update,
  };
};

export function useToast() {
  const [state, setState] = useState(toastStore.getState());

  useEffect(() => {
    return toastStore.subscribe(() => {
      setTimeout(() => {
        setState(toastStore.getState());
      }, 0);
    });
  }, []);


  useEffect(() => {
    const timeouts = state.toasts
      .filter((toast) => toast.duration !== Infinity)
      .map((toast) =>
        setTimeout(() => {
          toast.dismiss();
        }, toast.duration || 5000)
      );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [state.toasts]);

  return {
    toast,
    toasts: state.toasts,
  };
}
