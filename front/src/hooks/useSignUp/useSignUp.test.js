import React from 'react';
import { postSignUp } from '../../utils/api/v1/user';
import useSignUp from './useSignUp';

jest.mock('../../utils/api/v1/user');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (x) => x,
  }),
}));

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

    test('value with already user data', async () => {
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
        'This email was already registered',
      );
      expect(mockSetStates[1]).toBeCalledWith(true);
      expect(mockSetStates[2]).toBeCalledWith(null);
    });

    test('value with new user data', async () => {
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
      expect(mockSetStates[1]).toBeCalledWith(true);
      expect(mockSetStates[2]).toHaveBeenNthCalledWith(1, null);
      expect(mockSetStates[2]).toHaveBeenNthCalledWith(
        2,
        'Successfully signed up',
      );
    });
  });
});
