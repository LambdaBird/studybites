import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import useDebounce from '../../../hooks/useDebounce';

const { Search } = Input;

const DebouncedSearch = ({ delay, onChange, onSearch, ...props }) => {
  const [searchInput, setSearchInput] = useState(null);
  const debouncedValue = useDebounce(searchInput, delay);
  useEffect(() => {
    if (debouncedValue !== null) {
      onChange(debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <Search
      {...props}
      onSearch={(value) => value && onSearch(value)}
      onChange={(e) => setSearchInput(e.target.value)}
    />
  );
};

DebouncedSearch.defaultProps = {
  onChange: () => {},
  onSearch: () => {},
  delay: 500,
};

DebouncedSearch.propTypes = {
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  delay: PropTypes.number,
};

export default DebouncedSearch;
