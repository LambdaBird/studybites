import PropTypes from 'prop-types';

import { Statuses } from '@sb-ui/pages/Teacher/Home/LessonsDashboard/constants';

export const TeacherPropTypes = {
  students: PropTypes.arrayOf(PropTypes.shape({})),
  status: PropTypes.oneOf(Object.values(Statuses)).isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};
