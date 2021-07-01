import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SearchOutlined } from '@ant-design/icons';
import { useDebounce } from '@sb-ui/hooks/useDebounce';
import * as S from './DebouncedSearch.styled';

const DebouncedSearch = ({ delay, onChange, ...props }) => {
  const [searchInput, setSearchInput] = useState(null);
  const debouncedValue = useDebounce(searchInput, delay);
  useEffect(() => {
    if (debouncedValue !== null) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange]);

  return (
    <S.StyledInput
      {...props}
      onChange={(e) => setSearchInput(e.target.value)}
      prefix={<SearchOutlined />}
    />
  );
};

DebouncedSearch.defaultProps = {
  delay: 500,
};

DebouncedSearch.propTypes = {
  onChange: PropTypes.func.isRequired,
  delay: PropTypes.number,
};

export default DebouncedSearch;
