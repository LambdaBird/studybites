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
});
