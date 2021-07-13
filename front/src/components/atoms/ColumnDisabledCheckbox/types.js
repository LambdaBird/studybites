import PropTypes from 'prop-types';

export const ColumnDisabledCheckboxPropTypes = {
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
