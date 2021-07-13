import LessonsList from './LessonsList';
import OngoingLessons from './OngoingLessons';
import { HomePropTypes } from './types';
import * as S from './Home.styled';

const Home = ({ children }) => (
  <>
    <S.Main>
      <OngoingLessons />
      <LessonsList />
    </S.Main>
    {children}
  </>
);

Home.propTypes = HomePropTypes;

export default Home;
