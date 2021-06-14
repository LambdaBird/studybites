import { useTranslation } from 'react-i18next';
import { Button, Typography, Divider, Row, Col, Space, Avatar } from 'antd';
import emptyImage from '@sb-ui/resources/img/empty.svg';
import * as S from './StudentsList.styled';

const { Text } = Typography;

const TEMP_STUDENTS = [];

const StudentsList = () => {
  const { t } = useTranslation();

  return (
    <S.Wrapper>
      {!TEMP_STUDENTS.length ? (
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
            {TEMP_STUDENTS.map((el) => (
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

export default StudentsList;
