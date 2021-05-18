import React from 'react';
import usePasswordInput from './usePasswordInput';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (x) => x,
  }),
}));

describe('Test usePasswordInput', () => {
  describe('Test onChangePassword', () => {
    let onChangePassword;
    let mockSetStates = [];
    beforeEach(() => {
      jest.spyOn(React, 'useState').mockImplementation((initial) => {
        const setState = jest.fn();
        mockSetStates.push(setState);
        return [initial, setState];
      });
      const obj = usePasswordInput();
      onChangePassword = obj.onChangePassword;
    });

    afterEach(() => {
      mockSetStates = [];
    });

    test('value with 1 letter', () => {
      onChangePassword({
        target: {
          value: 'a',
        },
      });
      expect(mockSetStates[0]).toBeCalledWith('error');
      expect(mockSetStates[1]).toBeCalledWith(
        'Sign_up.password.min_5_symbols, sign_up.password.one_numerical',
      );
      expect(mockSetStates[2]).toBeCalledWith('a');
    });

    test('value with 1 number', () => {
      onChangePassword({
        target: {
          value: '1',
        },
      });
      expect(mockSetStates[0]).toBeCalledWith('error');
      expect(mockSetStates[1]).toBeCalledWith(
        'Sign_up.password.min_5_symbols, sign_up.password.one_non_numerical',
      );
      expect(mockSetStates[2]).toBeCalledWith('1');
    });

    test('value with 1 letter and number', () => {
      onChangePassword({
        target: {
          value: 'a1',
        },
      });
      expect(mockSetStates[0]).toBeCalledWith('error');
      expect(mockSetStates[1]).toBeCalledWith('Sign_up.password.min_5_symbols');
      expect(mockSetStates[2]).toBeCalledWith('a1');
    });

    test('value with 6 letters', () => {
      onChangePassword({
        target: {
          value: 'abcdefg',
        },
      });
      expect(mockSetStates[0]).toBeCalledWith('error');
      expect(mockSetStates[1]).toBeCalledWith('Sign_up.password.one_numerical');
      expect(mockSetStates[2]).toBeCalledWith('abcdefg');
    });

    test('value with 6 numbers', () => {
      onChangePassword({
        target: {
          value: '123456',
        },
      });
      expect(mockSetStates[0]).toBeCalledWith('error');
      expect(mockSetStates[1]).toBeCalledWith(
        'Sign_up.password.one_non_numerical',
      );
      expect(mockSetStates[2]).toBeCalledWith('123456');
    });

    test('value with 6 symbols', () => {
      onChangePassword({
        target: {
          value: '######',
        },
      });
      expect(mockSetStates[0]).toBeCalledWith('error');
      expect(mockSetStates[1]).toBeCalledWith(
        'Sign_up.password.one_non_numerical, sign_up.password.one_numerical',
      );
      expect(mockSetStates[2]).toBeCalledWith('######');
    });

    test('value with 1 symbol', () => {
      onChangePassword({
        target: {
          value: '#',
        },
      });
      expect(mockSetStates[0]).toBeCalledWith('error');
      expect(mockSetStates[1]).toBeCalledWith(
        'Sign_up.password.min_5_symbols, sign_up.password.one_non_numerical, sign_up.password.one_numerical',
      );
      expect(mockSetStates[2]).toBeCalledWith('#');
    });

    test('correct value', () => {
      onChangePassword({
        target: {
          value: 'abcde5',
        },
      });
      expect(mockSetStates[0]).toBeCalledWith('success');
      expect(mockSetStates[1]).toBeCalledWith('');
      expect(mockSetStates[2]).toBeCalledWith('abcde5');
    });
  });

  describe('Test passwordValidator', () => {
    let getPasswordSuccess;

    beforeEach(() => {
      jest
        .spyOn(React, 'useState')
        .mockImplementation((initial) => [initial, jest.fn()]);
      const obj = usePasswordInput();
      const { passwordValidator } = obj;
      getPasswordSuccess = async (password) => {
        let success;
        try {
          await passwordValidator(null, password);
          success = true;
        } catch (e) {
          success = false;
        }
        return success;
      };
    });

    test('value with one letter', async () => {
      const success = await getPasswordSuccess('a');
      expect(success).toBe(false);
    });

    test('value with 1 number', async () => {
      const success = await getPasswordSuccess('1');
      expect(success).toBe(false);
    });

    test('value with 1 letter and number', async () => {
      const success = await getPasswordSuccess('a1');
      expect(success).toBe(false);
    });

    test('value with 6 letters ', async () => {
      const success = await getPasswordSuccess('abcdef');
      expect(success).toBe(false);
    });

    test('value with 6 numbers', async () => {
      const success = await getPasswordSuccess('123456');
      expect(success).toBe(false);
    });

    test('value with 6 symbols', async () => {
      const success = await getPasswordSuccess('######');
      expect(success).toBe(false);
    });

    test('value with 1 symbol', async () => {
      const success = await getPasswordSuccess('#');
      expect(success).toBe(false);
    });

    test('correct value', async () => {
      const success = await getPasswordSuccess('abcde9');
      expect(success).toBe(true);
    });

    test('empty value', async () => {
      const success = await getPasswordSuccess('');
      expect(success).toBe(false);
    });
  });
});
