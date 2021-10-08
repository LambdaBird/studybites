import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import CoursesDashboard from '@sb-ui/pages/Teacher/Home/Dashboard/CoursesDashboard';
import LessonsDashboard from '@sb-ui/pages/Teacher/Home/Dashboard/LessonsDashboard';
import { sbPostfix } from '@sb-ui/utils/constants';

import StudentsList from './StudentsList';
import TeacherInfo from './TeacherInfo';
import * as S from './Home.styled';

const Home = () => {
  const { t } = useTranslation('teacher');

  return (
    <>
      <Helmet>
        <title>
          {t('pages.home')}
          {sbPostfix}
        </title>
      </Helmet>
      <S.Page>
        <S.StyledRow>
          <S.LeftCol>
            <TeacherInfo />
            <LessonsDashboard />
            <CoursesDashboard />
          </S.LeftCol>
          <S.RightCol>
            <StudentsList />
          </S.RightCol>
        </S.StyledRow>
      </S.Page>
    </>
  );
};

export default Home;
