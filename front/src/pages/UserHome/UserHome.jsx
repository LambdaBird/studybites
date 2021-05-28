import React from 'react';
import { MainDiv } from './UserHome.styled';
import OpenLessons from '../../components/moleculas/OpenLessons';
import OngoingLessons from '../../components/moleculas/OngoingLessons';

const UserHome = () => (
  <MainDiv>
    <OngoingLessons />
    <OpenLessons />
  </MainDiv>
);

export default UserHome;
