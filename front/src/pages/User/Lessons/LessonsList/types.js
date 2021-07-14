import PropTypes from 'prop-types';

export const LessonsListPropTypes = {
  title: PropTypes.string.isRequired,
  notFound: PropTypes.string.isRequired,
  query: PropTypes.shape({
    key: PropTypes.string.isRequired,
    func: PropTypes.func.isRequired,
  }),
};
