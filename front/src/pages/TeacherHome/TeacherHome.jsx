import React, { useEffect } from 'react';
import { Col } from 'antd';
import TeacherInfo from './TeacherInfo';
import StudentsList from './StudentsList';
import LessonsDashboard from './LessonsDashboard';
import useGetLessons from '../../hooks/useGetLessons';
import useGetStudents from '../../hooks/useGetStudents';
import * as S from './TeacherHome.styled';

const pageLessonsLimit = 8;
const initialPage = 1;

const TeacherHome = () => {
  const { getLessonsRequest, lessonsData, isLoading, pagination, actions } =
    useGetLessons(pageLessonsLimit, initialPage);
  const {
    getStudentsRequest,
    studentsData,
    isLoading: studentsIsLoading,
  } = useGetStudents(pageLessonsLimit);

  useEffect(() => {
    getLessonsRequest();
    getStudentsRequest();
  }, [getLessonsRequest, getStudentsRequest]);

  return (
    <S.Page>
      <S.Wrapper gutter={[32, 32]} justify="center" align="top" wrap={false}>
        <Col span={17}>
          <TeacherInfo
            username="MrH"
            description="Very cool teacher | awesome"
            avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            lessons={9}
            students={8}
          />
          <LessonsDashboard
            lessons={lessonsData}
            loading={isLoading}
            pagination={pagination}
            actions={actions}
          />
        </Col>
        <Col span={7}>
          <StudentsList students={studentsData} loading={studentsIsLoading} />
        </Col>
      </S.Wrapper>
    </S.Page>
  );
};

export default TeacherHome;
