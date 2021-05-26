import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Avatar, Image } from 'antd';
import * as S from './UserInfo.styled';

const UserInfo = ({ role, avatar, username, description, lessons, students, avgRating }) => {
  const { t } = useTranslation();
  const statisticColumns = role === 'teacher'
    ? [
        {
          key: 0,
          title: <S.StatisticTitle>{t('user_info.lessons')}</S.StatisticTitle>,
          value: lessons,
          suffix: '',
        },
        {
          key: 1,
          title: <S.StatisticTitle>{t('user_info.students')}</S.StatisticTitle>,
          value: students,
          suffix: '',
        },
        {
          key: 2,
          title: <S.StatisticTitle>{t('user_info.avg_rating')}</S.StatisticTitle>,
          value: avgRating,
          suffix: <S.Suffix>{t('user_info.avg_rating_suffix')}</S.Suffix>
        }
      ]
    : [];

  return (
    <S.Wrapper justify="center" align="center">
      <S.AvatarCol xs={{ span: 4 }} sm={{ span: 2 }} md={{ span: 2 }} lg={{ span: 2 }} >
        <Avatar
          size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
          src={<Image src={avatar} />}	
        />
      </S.AvatarCol>
      <S.TextCol xs={{ span: 10 }} sm={{ span: 12 }} md={{ span: 13 }} lg={{ span: 14 }} >
        <S.WelcomeText>
          {`${t('user_info.greeting')}${username}${t('user_info.wishes')}`}
        </S.WelcomeText>
        <S.UserDescription>{description}</S.UserDescription>
      </S.TextCol>
      <S.StatisticCol xs={{ span: 10 }} sm={{ span: 10 }} md={{ span: 9 }} lg={{ span: 8 }} >
        {statisticColumns.map((column, index) => (
          <React.Fragment key={column.key}>
            {index
              ? <S.StatisticDivider
                  type="vertical"
                  style={{ height: "50%" }}
                />
              : null}
            <S.StatisticCell
              title={column.title}
              value={column.value}
              suffix={column.suffix}
              valueStyle={{ textAlign: "right" }}
            />
          </React.Fragment>))}
      </S.StatisticCol>
    </S.Wrapper>
  );
};

UserInfo.propTypes = {
  role: PropTypes.oneOf(['student', 'teacher']),
  avatar: PropTypes.string,
  username: PropTypes.string,
  description: PropTypes.string,
  lessons: PropTypes.number,
  students: PropTypes.number,
  avgRating: PropTypes.number,
};

UserInfo.defaultProps = {
  role: 'teacher',
  avatar: '',
  username: '',
  description: '',
  lessons: 0,
  students: 0,
  avgRating: 0,
};

export default UserInfo;