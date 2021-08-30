import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { fetchKeywords } from '@sb-ui/utils/api/v1/keywords';

import * as S from './KeywordsFilter.styled';

const KeywordsFilter = ({ width = '250px', margin = '1rem', setValues }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchKeywords().then((data) => setOptions(data));
  }, []);

  return (
    <S.Select
      width={width}
      margin={margin}
      mode="multiple"
      placeholder="Select item"
      maxTagCount="responsive"
      onSearch={(search) =>
        fetchKeywords({ search }).then((data) => setOptions(data))
      }
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
