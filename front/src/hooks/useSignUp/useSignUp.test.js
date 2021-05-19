import React from 'react';
import { useTranslation } from 'react-i18next';
import { postSignUp } from '../../utils/api/v1/user';
import useSignUp from './useSignUp';

jest.mock('../../utils/api/v1/user');

jest.mock('react-i18next');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe('Test useSignUp', () => {
  describe('Test auth', () => {
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

    test('server responses with unknown key', async () => {
      const DEFAULT_MESSAGE = 'DEFAULT_MESSAGE';
      useTranslation.mockImplementation(() => ({
        t: (x) => x,
      }));
      const [auth] = await useSignUp();
      postSignUp.mockImplementation(() => ({
        status: 409,
        data: {
          fallback: 'errors.unique_violation',
          errors: [
            {
              key: 'unknown_key',
              message: DEFAULT_MESSAGE,
            },
          ],
        },
      }));
      await auth({
        firstName: 'test',
        lastName: 'test',
        password: 'password',
        email: 'hello@gmail.com',
      });

      expect(mockSetStates[0]).toHaveBeenNthCalledWith(1, null);
      expect(mockSetStates[0]).toHaveBeenNthCalledWith(2, DEFAULT_MESSAGE);
      expect(mockSetStates[1]).toHaveBeenNthCalledWith(1, true);
      expect(mockSetStates[1]).toHaveBeenNthCalledWith(2, false);
      expect(mockSetStates[2]).toBeCalledWith(null);
    });

    test('value with already user data', async () => {
      const ALREADY_REGISTERED_TRANSLATION = 'ALREADY_REGISTERED_TRANSLATION';
      useTranslation.mockImplementation(() => ({
        t: () => ALREADY_REGISTERED_TRANSLATION,
      }));
      const [auth] = await useSignUp();
      postSignUp.mockImplementation(() => ({
        status: 409,
        data: {
          fallback: 'errors.unique_violation',
          errors: [
            {
              key: 'sign_up.email.already_registered',
              message: 'This email was already registered',
            },
          ],
        },
      }));
      await auth({
        firstName: 'test',
        lastName: 'test',
        password: 'password',
        email: 'hello@gmail.com',
      });

      expect(mockSetStates[0]).toHaveBeenNthCalledWith(1, null);
      expect(mockSetStates[0]).toHaveBeenNthCalledWith(
        2,
        ALREADY_REGISTERED_TRANSLATION,
      );
      expect(mockSetStates[1]).toHaveBeenNthCalledWith(1, true);
      expect(mockSetStates[1]).toHaveBeenNthCalledWith(2, false);
      expect(mockSetStates[2]).toBeCalledWith(null);
    });

    test('value with new user data', async () => {
      const ACTION_SUCCESS_TRANSLATION = 'ACTION_SUCCESS_TRANSLATION';
      useTranslation.mockImplementation(() => ({
        t: () => ACTION_SUCCESS_TRANSLATION,
      }));
      const [auth] = await useSignUp();
      postSignUp.mockImplementation(() => ({
        status: 201,
        data: {
          key: 'sign_up.action_success',
          message: 'Successfully signed up',
        },
      }));
      await auth({
        firstName: 'test',
        lastName: 'test',
        password: 'password',
        email: 'hello@gmail.com',
      });
      expect(mockSetStates[0]).toBeCalledWith(null);
      expect(mockSetStates[1]).toHaveBeenNthCalledWith(1, true);
      expect(mockSetStates[1]).toHaveBeenNthCalledWith(2, false);
      expect(mockSetStates[2]).toHaveBeenNthCalledWith(1, null);
      expect(mockSetStates[2]).toHaveBeenNthCalledWith(
        2,
        ACTION_SUCCESS_TRANSLATION,
      );
    });
  });
});
