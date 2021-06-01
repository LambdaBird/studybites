import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Avatar, Image, Typography } from 'antd';
import * as S from './TeacherInfo.styled';

const { Title, Text } = Typography;

const TeacherInfo = ({ avatar, username, description, lessons, students }) => {
  const { t } = useTranslation();
  const statisticColumns = [
    {
      key: 0,
      title: <Text type="secondary">{t('teacher_info.lessons')}</Text>,
      value: lessons,
      suffix: '',
    },
    {
      key: 1,
      title: <Text type="secondary">{t('teacher_info.students')}</Text>,
      value: students,
      suffix: '',
    },
  ];

  return (
    <S.Wrapper justify="center" align="center">
      <S.AvatarCol span={2}>
        <Avatar size={64} src={<Image src={avatar} preview={false} />} />
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
            <S.StatisticDivider type="vertical" style={{ height: '50%' }} />
          </React.Fragment>
        ))}
      </S.StatisticCol>
    </S.Wrapper>
  );
};

TeacherInfo.propTypes = {
  avatar: PropTypes.string,
  username: PropTypes.string,
  description: PropTypes.string,
  lessons: PropTypes.number,
  students: PropTypes.number,
};

TeacherInfo.defaultProps = {
  avatar: '',
  username: '',
  description: '',
  lessons: 0,
  students: 0,
};

export default TeacherInfo;
