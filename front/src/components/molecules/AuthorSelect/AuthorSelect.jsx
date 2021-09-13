import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { fetchAuthors } from '@sb-ui/utils/api/v1/user';

import * as S from './AuthorSelect.styled';

const AuthorSelect = ({ width = '250px', setValues }) => {
  const { t } = useTranslation('common');
  const [options, setOptions] = useState([]);

  const handleSearch = async (search) => {
    const data = await fetchAuthors({ search });
    setOptions(data);
  };

  useEffect(() => {
    (async () => {
      await handleSearch('');
    })();
  }, []);

  return (
    <S.Select
      width={width}
      placeholder={t('filter_author.placeholder')}
      onSearch={handleSearch}
      onChange={setValues}
      options={options}
    />
  );
};

AuthorSelect.propTypes = {
  width: PropTypes.string,
  setValues: PropTypes.func,
};

export default AuthorSelect;
