import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Progress } from 'antd';
import { useTranslation } from 'react-i18next';
import useGetLessonToLearn from '../../hooks/useGetLessonToLearn';
import InfoBlock from './InfoBlock';
import * as S from './LessonPage.styled';

const LessonPage = () => {
  const [percents, setPercents] = useState(0);
  const { id: lessonId } = useParams();
  const { getLessonToLearnRequest, isError, isLoading, lessonData } = useGetLessonToLearn(lessonId);
  const { t } = useTranslation();

  useEffect(() => {
    getLessonToLearnRequest();
  }, []);

  useEffect(() => {
    if (lessonData && ! isError) {
      const { data: { blocks }, data: { progress } } = lessonData;
      const hundredPercents = 100;
      const progressPercents = progress * hundredPercents / blocks;
      setPercents(progressPercents.toFixed(2));
    }
  }, [lessonData]);

  return (
    <S.Page>
      <S.ProgressCol span={24}>
        <Progress showInfo={false} percent={percents} strokeWidth={4} strokeLinecap='round' />
      </S.ProgressCol>
      <S.PageRow justify="center" align="top">
        <S.BlockCol xs={{ span: 20 }} sm={{ span: 18 }} md={{ span: 16 }} lg={{ span: 12 }}>
          <InfoBlock isLoading={isLoading} isError={isError} lessonData={lessonData} />
        </S.BlockCol>
      </S.PageRow>
      <S.PageRow justify="center" align="top">
        <S.BlockCol xs={{ span: 22 }} sm={{ span: 20 }} md={{ span: 18 }} lg={{ span: 12 }}>
          <S.LessonButton>{t('lesson.start')}</S.LessonButton>
        </S.BlockCol>
      </S.PageRow>
    </S.Page>
  );
};

export default LessonPage;