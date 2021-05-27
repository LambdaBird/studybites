import React from 'react';
import { Col } from 'antd';
import TeacherInfo from './TeacherInfo';
import StudentsList from './StudentsList';
import LessonsDashboard from './LessonsDashboard';
import * as S from './TeacherHome.styled';

const TeacherHome = () => (
  <S.Page>
    <S.Wrapper gutter={[32, 32]} justify="center" align="top">
      <Col span={17} align="middle">
        <TeacherInfo
          username="MrH"
          description="Very cool teacher | awesome"
          avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          lessons={9}
          students={8}
        />
        <LessonsDashboard />
      </Col>
      <Col span={7}>
        <StudentsList />
      </Col>
    </S.Wrapper>
  </S.Page>
);

export default TeacherHome;
