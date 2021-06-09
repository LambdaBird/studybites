import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import { useDebounce } from '@sb-ui/hooks/useDebounce';

const DebouncedSearch = ({ delay, onChange, ...props }) => {
  const [searchInput, setSearchInput] = useState(null);
  const debouncedValue = useDebounce(searchInput, delay);
  useEffect(() => {
    if (debouncedValue !== null) {
      onChange(debouncedValue);
    }
  }, [debouncedValue]);

  return <Input {...props} onChange={(e) => setSearchInput(e.target.value)} />;
};

DebouncedSearch.defaultProps = {
  delay: 500,
};

DebouncedSearch.propTypes = {
  onChange: PropTypes.func.isRequired,
  delay: PropTypes.number,
};

export default DebouncedSearch;
