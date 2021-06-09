import OpenLessons from '@sb-ui/components/molecules/OpenLessons';
import OngoingLessons from '@sb-ui/components/molecules/OngoingLessons';

import { MainDiv } from './UserHome.styled';

const UserHome = () => (
  <MainDiv>
    <OngoingLessons />
    <OpenLessons />
  </MainDiv>
);

export default UserHome;
