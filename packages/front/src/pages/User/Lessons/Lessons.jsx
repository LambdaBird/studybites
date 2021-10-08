import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import { LESSONS_RESOURCE_KEY } from '@sb-ui/pages/User/constants';
import {
  getEnrolledLessons,
  getEnrolledLessonsFinished,
} from '@sb-ui/utils/api/v1/student';
import { sbPostfix } from '@sb-ui/utils/constants';
import {
  USER_ENROLLED_LESSONS_BASE_KEY,
  USER_ENROLLED_LESSONS_FINISHED_BASE_KEY,
} from '@sb-ui/utils/queries';

import ResourcesList from './ResourcesList';
import * as S from './Lessons.styled';

const Lessons = () => {
  const { t } = useTranslation('user');

  return (
    <>
      <Helmet>
        <title>
          {t('pages.lessons')}
          {sbPostfix}
        </title>
      </Helmet>
      <S.MainDiv>
        <ResourcesList
          resourceKey={LESSONS_RESOURCE_KEY}
          title={t('home.ongoing_lessons.title')}
          notFound={t('home.ongoing_lessons.not_found')}
          query={{
            key: USER_ENROLLED_LESSONS_BASE_KEY,
            func: getEnrolledLessons,
          }}
        />
        <ResourcesList
          resourceKey={LESSONS_RESOURCE_KEY}
          title={t('home.finished_lessons.title')}
          notFound={t('home.finished_lessons.not_found')}
          query={{
            key: USER_ENROLLED_LESSONS_FINISHED_BASE_KEY,
            func: getEnrolledLessonsFinished,
          }}
        />
      </S.MainDiv>
    </>
  );
};

export default Lessons;
