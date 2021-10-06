import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import { COURSES_RESOURCE_KEY } from '@sb-ui/pages/User/constants';
import * as S from '@sb-ui/pages/User/Lessons/Lessons.styled';
import ResourcesList from '@sb-ui/pages/User/Lessons/ResourcesList';
import {
  getEnrolledCourses,
  getEnrolledCoursesFinished,
} from '@sb-ui/utils/api/v1/student';
import {
  USER_ENROLLED_COURSES_BASE_KEY,
  USER_ENROLLED_COURSES_FINISHED_BASE_KEY,
} from '@sb-ui/utils/queries';

const Courses = () => {
  const { t } = useTranslation('user');

  return (
    <>
      <Helmet>
        <title>{t('pages.courses')}</title>
      </Helmet>
      <S.MainDiv>
        <ResourcesList
          resourceKey={COURSES_RESOURCE_KEY}
          title={t('home.ongoing_courses.title')}
          notFound={t('home.ongoing_courses.not_found')}
          query={{
            key: USER_ENROLLED_COURSES_BASE_KEY,
            func: getEnrolledCourses,
          }}
        />
        <ResourcesList
          resourceKey={COURSES_RESOURCE_KEY}
          title={t('home.finished_courses.title')}
          notFound={t('home.finished_courses.not_found')}
          query={{
            key: USER_ENROLLED_COURSES_FINISHED_BASE_KEY,
            func: getEnrolledCoursesFinished,
          }}
        />
      </S.MainDiv>
    </>
  );
};

export default Courses;
