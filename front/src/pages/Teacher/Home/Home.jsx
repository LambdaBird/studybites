import CoursesDashboard from '@sb-ui/pages/Teacher/Home/Dashboard/CoursesDashboard';
import LessonsDashboard from '@sb-ui/pages/Teacher/Home/Dashboard/LessonsDashboard';

import StudentsList from './StudentsList';
import TeacherInfo from './TeacherInfo';
import * as S from './Home.styled';

const Home = () => (
  <S.Page>
    <S.StyledRow>
      <S.LeftCol>
        <TeacherInfo />
        <LessonsDashboard />
        {!process.env.REACT_APP_DEMO_MODE && <CoursesDashboard />}
      </S.LeftCol>
      <S.RightCol>
        <StudentsList />
      </S.RightCol>
    </S.StyledRow>
  </S.Page>
);

export default Home;
