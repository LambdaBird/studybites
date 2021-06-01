import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Typography, Divider, Row, Col, Space, Avatar } from 'antd';
import * as S from './StudentsList.styled';
import emptyImage from '../../../resources/img/empty_students.svg';

const { Text } = Typography;

const StudentsList = ({ students, loading }) => {
  const { t } = useTranslation();

  return (
    <S.Wrapper>
      {loading || !students?.length ? (
        <>
          <S.EmptyListHeader>
            <S.ListTitle level={4}>{t('students_list.title')}</S.ListTitle>
          </S.EmptyListHeader>
          <S.EmptyList
            image={emptyImage}
            imageStyle={{
              height: 60,
            }}
            description={<Text>{t('students_list.no_students')}</Text>}
          >
            <Button type="link" onClick={() => {}}>
              {t('students_list.invite')}
            </Button>
          </S.EmptyList>
        </>
      ) : (
        <>
          <S.ListHeader>
            <S.ListTitle level={4}>{t('students_list.title')}</S.ListTitle>
            <Button type="link" onClick={() => {}}>
              {t('students_list.all')}
            </Button>
          </S.ListHeader>
          <Divider />
          <Row justify="center" align="top">
            {students.map((el) => (
              <Col span={12}>
                <Space>
                  <Avatar src={el.cover} />
                  <Text>{el.name}</Text>
                </Space>
              </Col>
            ))}
          </Row>
        </>
      )}
    </S.Wrapper>
  );
};

StudentsList.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      cover: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }),
  ),
  loading: PropTypes.bool.isRequired,
};

StudentsList.defaultProps = {
  students: [],
};

export default StudentsList;
