import reactRouterDom from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { HOME, SIGN_IN } from '@sb-ui/utils/paths';

import '../i18n';
import './mocks/matchMedia';

import Header from '../components/molecules/Header';
import SignIn from '../pages/SignIn';
import { postSignIn } from '../utils/api/v1/user';
import { clearJWT,getJWTAccessToken, setJWT } from '../utils/jwt';

jest.mock('react-router-dom');
jest.mock('../utils/jwt');
jest.mock('../utils/api/v1/user');

describe('Sign out test', () => {
  const ACCESS_TOKEN = 'ACCESS_TOKEN';
  const REFRESH_TOKEN = 'REFRESH_TOKEN';
  beforeEach(() => {});

  it('must save jwt in storage and redirect to "/" route', async () => {
    const setJWTMocked = jest.fn();
    const pushMocked = jest.fn();
    reactRouterDom.useHistory = jest.fn().mockReturnValue({ push: pushMocked });
    setJWT.mockImplementation(setJWTMocked);
    postSignIn.mockImplementation(() => ({
      status: 200,
      data: {
        accessToken: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN,
      },
    }));
    render(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'asd123' },
    });
    fireEvent.click(screen.getByText('Sign in'));
    await waitFor(() => expect(setJWTMocked).toHaveBeenCalledTimes(1));

    expect(setJWTMocked).toBeCalledWith({
      accessToken: ACCESS_TOKEN,
      refreshToken: REFRESH_TOKEN,
    });
    expect(pushMocked).toBeCalledWith('/');
  });

  it('must clear jwt from storage and redirect to "/sign-in" route ', async () => {
    const clearJWTMocked = jest.fn();
    const pushMocked = jest.fn();
    const getJWTAccessTokenMocked = jest.fn().mockReturnValue(ACCESS_TOKEN);
    reactRouterDom.useHistory = jest.fn().mockReturnValue({ push: pushMocked });
    reactRouterDom.useLocation = jest.fn().mockReturnValue({
      pathname: HOME,
    });
    getJWTAccessToken.mockImplementation(getJWTAccessTokenMocked);
    clearJWT.mockImplementation(clearJWTMocked);
    render(<Header />);
    fireEvent.click(screen.getByTestId('profile'));
    const SIGN_OUT_BUTTON_TEXT = 'Sign out';
    await waitFor(() => screen.getByText(SIGN_OUT_BUTTON_TEXT));
    fireEvent.click(screen.getByText(SIGN_OUT_BUTTON_TEXT));

    expect(pushMocked).toBeCalledWith(SIGN_IN);
    expect(clearJWTMocked).toBeCalled();
  });
});
