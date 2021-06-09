import ShallowRenderer from 'react-test-renderer/shallow';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

describe('Test PasswordStrengthIndicator', () => {
  test.each([
    ['no symbols', '', -1],
    ['3 letters', 'abc', 0],
    ['3 numbers', '123', 0],
    ['1 upper letter and 3 numbers', 'A123', 0],
    ['1 upper letter and 1 lower', 'Aa', 0],
    ['1 upper letter, 1 lower and 3 numbers', 'Aa123', 0],
    ['1 upper letter, 1 lower, 1 symbol and 3 numbers', 'Aa#123', 1],
    ['1 upper letter and 5 lower', 'Abcdef', 1],
    ['1 upper letter, 5 lower, 1 symbol, 1 number', 'Abcdef#1', 2],
    ['1 upper letter, 5 lower, 1 symbol, 3 number, len >= 10', 'Abcdef#123', 3],
  ])('value with %s', (_, payload, expected) => {
    const renderer = new ShallowRenderer();
    renderer.render(<PasswordStrengthIndicator value={payload} />);
    const result = renderer.getRenderOutput();
    const indicatorDiv = result.props.children;
    expect(indicatorDiv.props.level).toBe(expected);
  });
});
