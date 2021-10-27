import { Statuses } from '@sb-ui/pages/Teacher/Home/Dashboard/constants';

export const convertStatusToTranslation = (status) => {
  switch (status) {
    case Statuses.COURSE_ONLY:
      return 'course_only';
    default:
      return status.toLowerCase();
  }
};
