import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Typography } from 'antd';
import { getTeacherLessons } from '@sb-ui/utils/api/v1/teacher';
import {
  TEACHER_LESSONS_BASE_KEY,
  USER_BASE_QUERY,
} from '@sb-ui/utils/queries';
import { getUser } from '@sb-ui/utils/api/v1/user';
import * as S from './TeacherInfo.styled';

const { Title, Text } = Typography;

const TeacherInfo = () => {
  const { t } = useTranslation('teacher');
  const { data: userResponse } = useQuery(USER_BASE_QUERY, getUser);
  const user = userResponse?.data || {};

  const { data: lessonsResponseData } = useQuery(
    TEACHER_LESSONS_BASE_KEY,
    getTeacherLessons,
  );

  const statisticColumns = [
    {
      key: 0,
      title: <Text type="secondary">{t('info.lessons')}</Text>,
      value: lessonsResponseData?.total || '--',
      suffix: '',
    },
    {
      key: 1,
      title: <Text type="secondary">{t('info.students')}</Text>,
      value: '--',
      suffix: '',
    },
  ];

  const fullName = useMemo(
    () => `${user.firstName} ${user.lastName}`.trim(),
    [user.firstName, user.lastName],
  );

  const firstNameLetter = useMemo(
    () => user.firstName[0] || user.lastName[0],
    [user.firstName, user.lastName],
  );

  return (
    <S.Wrapper justify="center" align="center">
      <S.AvatarCol>
        <S.StyledAvatar size={64}>{firstNameLetter}</S.StyledAvatar>
      </S.AvatarCol>
      <S.TextCol span={14}>
        <Title level={4}>{t('info.greeting', { fullName })}</Title>
        <Text type="secondary">Your awesome description</Text>
      </S.TextCol>
      <S.StatisticCol span={8}>
        {statisticColumns.map((column) => (
          <React.Fragment key={column.key}>
            <S.StatisticCell
              title={column.title}
              value={column.value}
              suffix={column.suffix}
              valueStyle={{ textAlign: 'right' }}
            />
            <S.StatisticDivider type="vertical" />
          </React.Fragment>
        ))}
      </S.StatisticCol>
    </S.Wrapper>
  );
};

export default TeacherInfo;
