import AsyncSelect from 'react-select/async-creatable';

import { getKeywords } from '@sb-ui/utils/api/v1/keywords';

const Select = () => (
  <AsyncSelect
    cacheOptions
    isMulti
    loadOptions={async (search) => {
      const keywords = await getKeywords({ search });
      return keywords;
    }}
  />
);

export default Select;
