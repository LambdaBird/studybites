import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async-creatable';

import { fetchKeywords } from '@sb-ui/utils/api/v1/keywords';

const KeywordsSelect = ({ values, setValues, disabled }) => (
  <AsyncSelect
    isDisabled={disabled}
    cacheOptions
    isMulti
    defaultOptions
    value={values}
    onChange={(selected) => setValues(selected)}
    loadOptions={(search) => fetchKeywords({ search })}
  />
);

KeywordsSelect.propTypes = {
  values: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
    }),
  ),
  setValues: PropTypes.func,
  disabled: PropTypes.bool,
};

export default KeywordsSelect;
