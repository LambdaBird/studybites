import React from 'react';
import { usePasswordInput } from './usePasswordInput';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (x) => x,
  }),
}));

describe('Test usePasswordInput', () => {
  describe('Test onChangePassword', () => {
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

    test.each([
      [
        '1 letter',
        'a',
        'error',
        'Sign_up.password.min_5_symbols, sign_up.password.one_numerical',
      ],
      [
        '1 number',
        '1',
        'error',
        'Sign_up.password.min_5_symbols, sign_up.password.one_non_numerical',
      ],
      ['1 letter and number', 'a1', 'error', 'Sign_up.password.min_5_symbols'],
      ['6 letters', 'abcdefg', 'error', 'Sign_up.password.one_numerical'],
      ['6 numbers', '123456', 'error', 'Sign_up.password.one_non_numerical'],
      [
        '6 symbols',
        '######',
        'error',
        'Sign_up.password.one_non_numerical, sign_up.password.one_numerical',
      ],
      [
        '1 symbol',
        '#',
        'error',
        'Sign_up.password.min_5_symbols, sign_up.password.one_non_numerical, sign_up.password.one_numerical',
      ],
      ['correct value', 'abcde5', 'success', ''],
    ])(
      'value with %s',
      async (_, payload, expectedError, expectedErrorText) => {
        const { onChangePassword } = usePasswordInput();
        onChangePassword({
          target: {
            value: payload,
          },
        });
        expect(mockSetStates[0]).toBeCalledWith(expectedError);
        expect(mockSetStates[1]).toBeCalledWith(expectedErrorText);
        expect(mockSetStates[2]).toBeCalledWith(payload);
      },
    );
  });

  describe('Test passwordValidator', () => {
    beforeEach(() => {
      jest
        .spyOn(React, 'useState')
        .mockImplementation((initial) => [initial, jest.fn()]);
    });

    test.each([
      ['one letter', 'a', false],
      ['1 number', '1', false],
      ['1 letter and number', 'a1', false],
      ['6 letters', 'abcdef', false],
      ['6 numbers', '123456', false],
      ['6 symbols', '######', false],
      ['1 symbol', '#', false],
      ['empty value', '', false],
      ['correct value', 'abcde9', true],
    ])('value with %s', async (_, payload, expected) => {
      const { passwordValidator } = usePasswordInput();
      let success;
      try {
        await passwordValidator(null, payload);
        success = true;
      } catch (e) {
        success = false;
      }

      expect(success).toBe(expected);
    });
  });
});
