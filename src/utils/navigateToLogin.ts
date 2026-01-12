import { SESSION_PATHS } from '../routes/paths';

export const navigateToLogin = () => {
  localStorage.clear();
  window.location.href = SESSION_PATHS.SIGNIN;
};
