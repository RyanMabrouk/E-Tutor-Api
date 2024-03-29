import { User } from 'src/routes/users/domain/user';

export type LoginResponseType = Readonly<{
  tokenExpires: number;
  user: User;
}>;

export type LoginServiceResponseType = LoginResponseType &
  Readonly<{
    refreshToken: string;
    token: string;
  }>;

export type SuccessResponseType = Readonly<{
  status: 'success';
  message?: string;
}>;

export type ErrorResponseType = Readonly<{
  status: 'error';
  message?: string;
}>;
