import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Progress } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { getUserLesson } from '@sb-ui/utils/api/v1/lesson';
import InfoBlock from './InfoBlock';
import * as S from './LessonPage.styled';

const LESSON_BASE_QUERY = 'userLesson';

const LessonPage = () => {
  const { t } = useTranslation();
  const { id: lessonId } = useParams();

  const { data: responseData, isLoading } = useQuery(
    [LESSON_BASE_QUERY, lessonId],
    getUserLesson,
  );

  const { data } = responseData || {};

  const [percents] = useState(0);

  return (
    <S.Page>
      <S.Background />
      <S.ProgressCol span={24}>
        <Progress
          showInfo={false}
          percent={percents}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </S.ProgressCol>
      <S.PageRow justify="center" align="top">
        <S.BlockCol
          xs={{ span: 20 }}
          sm={{ span: 18 }}
          md={{ span: 16 }}
          lg={{ span: 12 }}
        >
          <InfoBlock isLoading={isLoading} lesson={data} />
        </S.BlockCol>
      </S.PageRow>
      <S.PageRow justify="center" align="top">
        <S.BlockCol
          xs={{ span: 22 }}
          sm={{ span: 20 }}
          md={{ span: 18 }}
          lg={{ span: 12 }}
        >
          <S.LessonButton>{t('lesson.start')}</S.LessonButton>
        </S.BlockCol>
      </S.PageRow>
    </S.Page>
  );
};

export default LessonPage;
