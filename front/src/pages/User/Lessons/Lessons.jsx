import { useTranslation } from 'react-i18next';

import {
  getEnrolledLessons,
  getEnrolledLessonsFinished,
} from '@sb-ui/utils/api/v1/student';
import {
  USER_ENROLLED_LESSONS_BASE_KEY,
  USER_ENROLLED_LESSONS_FINISHED_BASE_KEY,
} from '@sb-ui/utils/queries';

import LessonsList from './LessonsList';
import * as S from './Lessons.styled';

const Lessons = () => {
  const { t } = useTranslation('user');

  return (
    <S.MainDiv>
      <LessonsList
        title={t('home.ongoing_lessons.title')}
        notFound={t('home.ongoing_lessons.not_found')}
        query={{
          key: USER_ENROLLED_LESSONS_BASE_KEY,
          func: getEnrolledLessons,
        }}
      />
      <LessonsList
        title={t('home.finished_lessons.title')}
        notFound={t('home.finished_lessons.not_found')}
        query={{
          key: USER_ENROLLED_LESSONS_FINISHED_BASE_KEY,
          func: getEnrolledLessonsFinished,
        }}
        isFinished
      />
    </S.MainDiv>
  );
};

export default Lessons;
