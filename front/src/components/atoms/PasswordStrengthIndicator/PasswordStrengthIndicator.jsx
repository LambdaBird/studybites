import React from 'react';
import PropTypes from 'prop-types';
import { getPasswordStrength } from '../../../utils';
import { IndicatorDiv, LineDiv } from './PasswordStrengthIndicator.styled';

const PasswordStrengthIndicator = ({ value }) => {
  const level = getPasswordStrength(value);
  return (
    <LineDiv>
      <IndicatorDiv level={level} />
    </LineDiv>
  );
};

PasswordStrengthIndicator.propTypes = {
  value: PropTypes.string.isRequired,
};

export default PasswordStrengthIndicator;