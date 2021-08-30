import AsyncSelect from 'react-select/async-creatable';

import { fetchKeywords } from '@sb-ui/utils/api/v1/keywords';

const KeywordsSelect = () => (
  <AsyncSelect
    cacheOptions
    isMulti
    defaultOptions
    loadOptions={(search) => fetchKeywords({ search })}
  />
);

export default KeywordsSelect;
