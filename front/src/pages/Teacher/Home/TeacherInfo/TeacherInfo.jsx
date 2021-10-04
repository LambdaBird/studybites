import { Typography } from 'antd';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { getTeacherLessons } from '@sb-ui/utils/api/v1/teacher';
import { getUser } from '@sb-ui/utils/api/v1/user';
import {
  TEACHER_LESSONS_BASE_KEY,
  USER_BASE_QUERY,
} from '@sb-ui/utils/queries';

import * as S from './TeacherInfo.styled';

const { Title, Text } = Typography;

const TeacherInfo = () => {
  const { t } = useTranslation('teacher');
  const { data: user } = useQuery(USER_BASE_QUERY, getUser);

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
    () => user.firstName?.[0] || user.lastName?.[0],
    [user.firstName, user.lastName],
  );

  const { description } = user || {};

  return (
    <S.Wrapper>
      <S.AvatarCol>
        <S.StyledAvatar>{firstNameLetter}</S.StyledAvatar>
      </S.AvatarCol>
      <S.TextCol>
        <Title level={4}>{t('info.greeting', { fullName })}</Title>
        <S.Description>{description}</S.Description>
      </S.TextCol>
      <S.StatisticCol>
        {statisticColumns.map((column) => (
          <React.Fragment key={column.key}>
            <S.StatisticCell
              title={column.title}
              value={column.value}
              suffix={column.suffix}
              valueStyle={{ textAlign: 'right' }}
            />
            <S.StatisticDivider />
          </React.Fragment>
        ))}
      </S.StatisticCol>
    </S.Wrapper>
  );
};

export default TeacherInfo;
