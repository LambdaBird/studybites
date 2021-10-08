import { getPasswordStrength } from '@sb-ui/utils';

import { PasswordStrengthIndicatorPropTypes } from './types';
import { IndicatorDiv, LineDiv } from './PasswordStrengthIndicator.styled';

const PasswordStrengthIndicator = ({ value }) => {
  const level = getPasswordStrength(value);
  return (
    <LineDiv>
      <IndicatorDiv level={level} />
    </LineDiv>
  );
};

PasswordStrengthIndicator.propTypes = PasswordStrengthIndicatorPropTypes;

export default PasswordStrengthIndicator;
