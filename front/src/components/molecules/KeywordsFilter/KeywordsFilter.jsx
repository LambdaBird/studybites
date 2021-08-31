import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { fetchKeywords } from '@sb-ui/utils/api/v1/keywords';

import * as S from './KeywordsFilter.styled';

const KeywordsFilter = ({ width = '250px', margin = '1rem', setValues }) => {
  const { t } = useTranslation('common');
  const [options, setOptions] = useState([]);

  const handleSearch = async (search) => {
    const data = await fetchKeywords({ search });
    setOptions(data);
  };

  useEffect(() => {
    (async () => {
      await handleSearch('');
    })();

  return (
    <S.Select
      width={width}
      margin={margin}
      placeholder={t('filter.placeholder')}
      onSearch={handleSearch}
      onChange={setValues}
      options={options}
    />
  );
};

KeywordsFilter.propTypes = {
  width: PropTypes.string,
  margin: PropTypes.string,
  setValues: PropTypes.func,
};

export default KeywordsFilter;
