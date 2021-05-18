import usePasswordInput from './usePasswordInput';

const mockSetState = jest.fn();

jest.mock('react', () => ({
  useState: (initial) => [initial, mockSetState],
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (x) => x,
  }),
}));

describe('Test usePasswordInput', () => {
  describe('Test onChangePassword', () => {
    let onChangePassword;
    beforeEach(() => {
      const obj = usePasswordInput();
      onChangePassword = obj.onChangePassword;
    });

    test('value with 1 letter', () => {
      onChangePassword({
        target: {
          value: 'a',
        },
      });
      expect(mockSetState).toBeCalledWith('a');
      expect(mockSetState).toBeCalledWith('error');
      expect(mockSetState).toBeCalledWith(
        'Sign_up.password.min_5_symbols, sign_up.password.one_numerical',
      );
    });

    test('value with 1 number', () => {
      onChangePassword({
        target: {
          value: '1',
        },
      });
      expect(mockSetState).toBeCalledWith('1');
      expect(mockSetState).toBeCalledWith('error');
      expect(mockSetState).toBeCalledWith(
        'Sign_up.password.min_5_symbols, sign_up.password.one_non_numerical',
      );
    });

    test('value with 1 letter and number', () => {
      onChangePassword({
        target: {
          value: 'a1',
        },
      });
      expect(mockSetState).toBeCalledWith('a1');
      expect(mockSetState).toBeCalledWith('error');
      expect(mockSetState).toBeCalledWith('Sign_up.password.min_5_symbols');
    });

    test('value with 6 letters', () => {
      onChangePassword({
        target: {
          value: 'abcdefg',
        },
      });
      expect(mockSetState).toBeCalledWith('abcdefg');
      expect(mockSetState).toBeCalledWith('error');
      expect(mockSetState).toBeCalledWith('Sign_up.password.one_numerical');
    });

    test('value with 6 numbers', () => {
      onChangePassword({
        target: {
          value: '123456',
        },
      });
      expect(mockSetState).toBeCalledWith('123456');
      expect(mockSetState).toBeCalledWith('error');
      expect(mockSetState).toBeCalledWith('Sign_up.password.one_non_numerical');
    });

    test('value with 6 symbols', () => {
      onChangePassword({
        target: {
          value: '######',
        },
      });
      expect(mockSetState).toBeCalledWith('######');
      expect(mockSetState).toBeCalledWith('error');
      expect(mockSetState).toBeCalledWith(
        'Sign_up.password.one_non_numerical, sign_up.password.one_numerical',
      );
    });

    test('value with 1 symbol', () => {
      onChangePassword({
        target: {
          value: '#',
        },
      });
      expect(mockSetState).toBeCalledWith('#');
      expect(mockSetState).toBeCalledWith('error');
      expect(mockSetState).toBeCalledWith(
        'Sign_up.password.min_5_symbols, sign_up.password.one_non_numerical, sign_up.password.one_numerical',
      );
    });

    test('correct value', () => {
      onChangePassword({
        target: {
          value: 'abcde5',
        },
      });
      expect(mockSetState).toBeCalledWith('abcde5');
      expect(mockSetState).toBeCalledWith('success');
      expect(mockSetState).toBeCalledWith('');
    });
  });
});
