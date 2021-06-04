import React from 'react';
import { MainDiv } from './UserHome.styled';
import OpenLessons from '../../components/molecules/OpenLessons';
import OngoingLessons from '../../components/molecules/OngoingLessons';

const UserHome = () => (
  <MainDiv>
    <OngoingLessons />
    <OpenLessons />
  </MainDiv>
);

export default UserHome;
