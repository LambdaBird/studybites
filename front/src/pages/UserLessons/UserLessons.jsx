import { useTranslation } from 'react-i18next';

import Search from '@sb-ui/components/molecules/Search';
import * as S from './UserLessons.styled';
import OngoingLessonsList from './UserLessonsList';

const UserLessons = () => {
  const { t } = useTranslation();

  return (
    <S.MainDiv>
      <OngoingLessonsList />
      <S.LessonsHeader justify="space-between" align="middle">
        <S.OpenLessonsTitle level={4}>
          {t('user_lessons.finished_lessons.title')}
        </S.OpenLessonsTitle>
        <Search setSearchText={() => {}} placement="bottomLeft" />
      </S.LessonsHeader>
    </S.MainDiv>
  );
};

export default UserLessons;
