import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../constants';
import { loginForCookies } from './loginForCookies';

export const getAdminCookies = async () => {
  const cookies = loginForCookies({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  return cookies;
};
