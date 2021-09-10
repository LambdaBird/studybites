import PropTypes from 'prop-types';

import { Statuses } from '@sb-ui/pages/Teacher/Home/Dashboard/constants';

export const TeacherPropTypes = {
  students: PropTypes.arrayOf(PropTypes.shape({})),
  status: PropTypes.oneOf(Object.values(Statuses)).isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};
