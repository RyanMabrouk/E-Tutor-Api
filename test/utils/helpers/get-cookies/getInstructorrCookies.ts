import { INSTRUCTOR_EMAIL, INSTRUCTOR_PASSWORD } from '../../constants';
import { loginForCookies } from './loginForCookies';

export const getInstructorrCookies = async () => {
  const cookies = loginForCookies({
    email: INSTRUCTOR_EMAIL,
    password: INSTRUCTOR_PASSWORD,
  });
  return cookies;
};
