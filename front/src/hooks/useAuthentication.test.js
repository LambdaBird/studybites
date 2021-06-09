import React from 'react';
import { useTranslation } from 'react-i18next';
import { postSignIn } from '../utils/api/v1/user';
import { setJWT } from '../utils/jwt';
import useAuthentication from './useAuthentication';

jest.mock('../../utils/api/v1/user');
jest.mock('../../utils/jwt/jwt');
jest.mock('react-i18next');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe('Test useAuthentication', () => {
  describe('Test postSignIn', () => {
    let mockSetStates = [];
    beforeEach(() => {
      jest.spyOn(React, 'useState').mockImplementation((initial) => {
        const setState = jest.fn();
        mockSetStates.push(setState);
        return [initial, setState];
      });
    });
    afterEach(() => {
      mockSetStates = [];
    });

    test('server responses with unauthorized', async () => {
      const WRONG_CREDENTIALS = 'WRONG_CREDENTIALS';
      useTranslation.mockImplementation(() => ({
        t: () => WRONG_CREDENTIALS,
      }));
      const [auth] = await useAuthentication(postSignIn);
      postSignIn.mockImplementation(() => ({
        status: 401,
        data: {
          fallback: 'errors.unauthorized',
          errors: [
            {
              message: 'Unauthorized',
            },
          ],
        },
      }));
      await auth({
        password: 'password',
        email: 'hello@gmail.com',
      });

      expect(mockSetStates[0]).toHaveBeenNthCalledWith(1, null);
      expect(mockSetStates[0]).toHaveBeenNthCalledWith(2, WRONG_CREDENTIALS);
      expect(mockSetStates[1]).toHaveBeenNthCalledWith(1, true);
      expect(mockSetStates[1]).toHaveBeenNthCalledWith(2, false);
    });

    test('value with ok credential', async () => {
      const ACCESS_TOKEN = 'accessToken';
      const REFRESH_TOKEN = 'refreshToken';
      useTranslation.mockImplementation(() => ({
        t: (x) => x,
      }));
      const [auth] = await useAuthentication(postSignIn);
      const setJWTMocked = jest.fn();
      setJWT.mockImplementation(setJWTMocked);
      postSignIn.mockImplementation(() => ({
        status: 200,
        data: {
          accessToken: ACCESS_TOKEN,
          refreshToken: REFRESH_TOKEN,
        },
      }));
      await auth({
        password: 'password',
        email: 'hello@gmail.com',
      });
      expect(setJWTMocked).toBeCalledWith({
        accessToken: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN,
      });
      expect(mockSetStates[0]).toHaveBeenNthCalledWith(1, null);
      expect(mockSetStates[1]).toHaveBeenNthCalledWith(1, true);
      expect(mockSetStates[1]).toHaveBeenNthCalledWith(2, false);
    });
  });
});
