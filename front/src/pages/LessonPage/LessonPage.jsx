import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Col } from 'antd';
import useGetLessonToLearn from '../../hooks/useGetLessonToLearn';
import InfoBlock from './InfoBlock';
import * as S from './LessonPage.styled';

const LessonPage = () => {
  const { id: lessonId } = useParams();
  const { getLessonToLearnRequest, isError, isLoading, lessonData } = useGetLessonToLearn(lessonId);

  useEffect(() => {
    getLessonToLearnRequest();
  }, []);

  console.log(isError, isLoading, lessonData);

  return (
    <S.Page justify="center" align="top">
      <Col xs={{ span: 20 }} sm={{ span: 18 }} md={{ span: 16 }} lg={{ span: 12 }} >
        <InfoBlock isLoading={isLoading} isError={isError} lessonData={lessonData} />
      </Col>
    </S.Page>
  );
};

export default LessonPage;