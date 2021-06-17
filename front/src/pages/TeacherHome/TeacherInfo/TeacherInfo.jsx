import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Avatar, Typography } from 'antd';
import {
  getTeacherLessons,
  getTeacherStudents,
} from '@sb-ui/utils/api/v1/lesson';
import * as S from './TeacherInfo.styled';
import {
  TEACHER_LESSONS_BASE_KEY,
  TEACHER_STUDENTS_BASE_KEY,
} from '../LessonsDashboard/constants';

const { Title, Text } = Typography;

const TeacherInfo = ({ username, description }) => {
  const { t } = useTranslation();

  const { data: lessonsResponseData } = useQuery(
    [TEACHER_LESSONS_BASE_KEY],
    getTeacherLessons,
  );

  const { data: studentsResponseData } = useQuery(
    [TEACHER_STUDENTS_BASE_KEY],
    getTeacherStudents,
  );

  useEffect(() => {
    console.log(studentsResponseData); // TODO NEED CONNECT FRONT
  }, [studentsResponseData]);

  const statisticColumns = [
    {
      key: 0,
      title: <Text type="secondary">{t('teacher_info.lessons')}</Text>,
      value: lessonsResponseData?.total || '--',
      suffix: '',
    },
    {
      key: 1,
      title: <Text type="secondary">{t('teacher_info.students')}</Text>,
      value: '--',
      suffix: '',
    },
  ];

  return (
    <S.Wrapper justify="center" align="center">
      <S.AvatarCol>
        <Avatar size={64}>T</Avatar>
      </S.AvatarCol>
      <S.TextCol span={14}>
        <Title level={4}>
          {`${t('teacher_info.greeting')}${username}${t(
            'teacher_info.wishes',
          )}`}
        </Title>
        <Text type="secondary">{description}</Text>
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

TeacherInfo.propTypes = {
  username: PropTypes.string,
  description: PropTypes.string,
};

TeacherInfo.defaultProps = {
  username: '',
  description: '',
};

export default TeacherInfo;
