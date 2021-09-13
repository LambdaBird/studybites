import { ChildrenType } from '@sb-ui/utils/types';

import OngoingLessons from './OngoingLessons';
import OpenCourses from './OpenCourses';
import OpenLessons from './OpenLessons';
import * as S from './Home.styled';

const Home = ({ children }) => (
  <>
    <S.Main>
      <OngoingLessons />
      <OpenLessons />
      <OpenCourses />
    </S.Main>
    {children}
  </>
);

Home.propTypes = {
  children: ChildrenType,
};

export default Home;
