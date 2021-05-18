import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

describe('Test PasswordStrengthIndicator', () => {
  let renderer;
  beforeEach(() => {
    renderer = new ShallowRenderer();
  });

  test('value with no symbols', () => {
    renderer.render(<PasswordStrengthIndicator value="" />);
    const result = renderer.getRenderOutput();
    const indicatorDiv = result.props.children;

    expect(indicatorDiv.props.level).toBe(-1);
  });

  test('value with 3 letters', () => {
    renderer.render(<PasswordStrengthIndicator value="abc" />);
    const result = renderer.getRenderOutput();
    const indicatorDiv = result.props.children;

    expect(indicatorDiv.props.level).toBe(0);
  });

  test('value with 3 numbers', () => {
    renderer.render(<PasswordStrengthIndicator value="123" />);
    const result = renderer.getRenderOutput();
    const indicatorDiv = result.props.children;

    expect(indicatorDiv.props.level).toBe(0);
  });

  test('value with 1 upper letter and 3 numbers', () => {
    renderer.render(<PasswordStrengthIndicator value="A123" />);
    const result = renderer.getRenderOutput();
    const indicatorDiv = result.props.children;

    expect(indicatorDiv.props.level).toBe(0);
  });

  test('value with 1 upper letter and 1 lower', () => {
    renderer.render(<PasswordStrengthIndicator value="Aa" />);
    const result = renderer.getRenderOutput();
    const indicatorDiv = result.props.children;

    expect(indicatorDiv.props.level).toBe(0);
  });

  test('value with 1 upper letter, 1 lower and 3 numbers', () => {
    renderer.render(<PasswordStrengthIndicator value="Aa123" />);
    const result = renderer.getRenderOutput();
    const indicatorDiv = result.props.children;

    expect(indicatorDiv.props.level).toBe(0);
  });

  test('value with 1 upper letter, 1 lower, 1 symbol and 3 numbers', () => {
    renderer.render(<PasswordStrengthIndicator value="Aa#123" />);
    const result = renderer.getRenderOutput();
    const indicatorDiv = result.props.children;

    expect(indicatorDiv.props.level).toBe(1);
  });

  test('value with 1 upper letter and 5 lower', () => {
    renderer.render(<PasswordStrengthIndicator value="Abcdef" />);
    const result = renderer.getRenderOutput();
    const indicatorDiv = result.props.children;

    expect(indicatorDiv.props.level).toBe(1);
  });

  test('value with 1 upper letter and 5 lower', () => {
    renderer.render(<PasswordStrengthIndicator value="Abcdef" />);
    const result = renderer.getRenderOutput();
    const indicatorDiv = result.props.children;

    expect(indicatorDiv.props.level).toBe(1);
  });

  test('value with 1 upper letter, 5 lower, 1 symbol, 1 number', () => {
    renderer.render(<PasswordStrengthIndicator value="Abcdef#1" />);
    const result = renderer.getRenderOutput();
    const indicatorDiv = result.props.children;

    expect(indicatorDiv.props.level).toBe(2);
  });

  test('value with 1 upper letter, 5 lower, 1 symbol, 3 number, len >= 10', () => {
    renderer.render(<PasswordStrengthIndicator value="Abcdef#123" />);
    const result = renderer.getRenderOutput();
    const indicatorDiv = result.props.children;

    expect(indicatorDiv.props.level).toBe(3);
  });
});
