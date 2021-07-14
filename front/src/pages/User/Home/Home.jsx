import { ChildrenType } from '@sb-ui/utils/types';

import LessonsList from './LessonsList';
import OngoingLessons from './OngoingLessons';
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

Home.propTypes = {
  children: ChildrenType,
};

export default Home;
