import React, { useEffect } from 'react';
import { Col } from 'antd';
import TeacherInfo from './TeacherInfo';
import StudentsList from './StudentsList';
import LessonsDashboard from './LessonsDashboard';
import useGetLessons from '../../hooks/useGetLessons';
import useGetStudents from '../../hooks/useGetStudents';
import * as S from './TeacherHome.styled';

const TeacherHome = () => {
  const { getLessonsRequest, lessonsData, isLoading } = useGetLessons();
  const { getStudentsRequest, studentsData, isLoading: studentsIsLoading } = useGetStudents();

  useEffect(() => {
    getLessonsRequest();
    getStudentsRequest();
  }, [getLessonsRequest, getStudentsRequest]);

  return (
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
          <LessonsDashboard lessons={lessonsData} loading={isLoading} />
        </Col>
        <Col span={7}>
          <StudentsList students={studentsData} loading={studentsIsLoading} />
        </Col>
      </S.Wrapper>
    </S.Page>
  )
};

export default TeacherHome;
