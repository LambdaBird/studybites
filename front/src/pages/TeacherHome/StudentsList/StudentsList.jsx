import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from 'antd';
import * as S from './StudentsList.styled';
import emptyImage from '../../../resources/img/empty_students.svg'

const { Text } = Typography;

const StudentsList = ({ students }) => {
  const { t } = useTranslation();

  return (
    <S.Wrapper>
      <S.ListTitle level={4}>{t('students_list.title')}</S.ListTitle>
      {(students && !students.length) 
        ? <S.EmptyList
            image={emptyImage}
            imageStyle={{
              height: 60,
            }}
            description={
              <Text>{t('students_list.no_students')}</Text>
            }
          >
          <Button type="link">{t('students_list.invite')}</Button>
          </S.EmptyList>
      : null}
    </S.Wrapper>
  );
};

StudentsList.propTypes = {
  students: PropTypes.arrayOf(PropTypes.shape({
    cover: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  })),
};

StudentsList.defaultProps = {
  students: [],
};

export default StudentsList;