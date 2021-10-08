import PropTypes from 'prop-types';

export const DebouncedSearchDefaultProps = {
  delay: 500,
};

export const DebouncedSearchPropTypes = {
  onChange: PropTypes.func.isRequired,
  delay: PropTypes.number,
};
