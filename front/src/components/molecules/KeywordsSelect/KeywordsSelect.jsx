import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async-creatable';

import { getKeywords } from '@sb-ui/utils/api/v1/keywords';

const KeywordsSelect = ({ values, setValues }) => {
  return (
    <AsyncSelect
      cacheOptions
      isMulti
      defaultOptions
      value={values}
      onChange={(selected) => setValues(selected)}
      loadOptions={async (search) => {
        const keywords = await getKeywords({ search });
        return keywords;
      }}
    />
  );
};

KeywordsSelect.propTypes = {
  values: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  setValues: PropTypes.func,
};

export default KeywordsSelect;
