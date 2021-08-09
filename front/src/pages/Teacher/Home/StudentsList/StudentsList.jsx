import { Button, Col, Divider, Skeleton, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

import { MAX_STUDENTS_IN_LIST } from '@sb-ui/pages/Teacher/Home/StudentsList/constants';
import emptyImage from '@sb-ui/resources/img/empty.svg';
import { getTeacherStudents } from '@sb-ui/utils/api/v1/teacher';
import { TEACHER_STUDENTS } from '@sb-ui/utils/paths';
import { TEACHER_STUDENTS_BASE_KEY } from '@sb-ui/utils/queries';
import { skeletonArray } from '@sb-ui/utils/utils';

import * as S from './StudentsList.styled';

const { Text } = Typography;

const StudentsList = () => {
  const { t } = useTranslation('teacher');
  const history = useHistory();
  const [students, setStudents] = useState([]);
  const { data: studentsResponseData, isLoading } = useQuery(
    TEACHER_STUDENTS_BASE_KEY,
    getTeacherStudents,
  );

  useEffect(() => {
    if (studentsResponseData) {
      setStudents(
        studentsResponseData?.students?.slice(0, MAX_STUDENTS_IN_LIST),
      );
    }
  }, [studentsResponseData]);

  const handleViewAllClick = () => {
    history.push(TEACHER_STUDENTS);
  };

  if (isLoading) {
    return (
      <S.Wrapper>
        <S.EmptyListHeader>
          <S.ListTitle>{t('students_list.title')}</S.ListTitle>
        </S.EmptyListHeader>
        <S.StudentsRow>
          {skeletonArray(MAX_STUDENTS_IN_LIST).map(({ id }) => (
            <Col key={id} span={12}>
              <Skeleton avatar paragraph={{ rows: 0 }} />
            </Col>
          ))}
        </S.StudentsRow>
      </S.Wrapper>
    );
  }

  return (
    <S.Wrapper>
      {!students.length ? (
        <>
          <S.EmptyListHeader>
            <S.ListTitle>{t('students_list.title')}</S.ListTitle>
          </S.EmptyListHeader>
          <S.EmptyList
            image={emptyImage}
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
            <S.ListTitle>{t('students_list.title')}</S.ListTitle>
            <Button type="link" onClick={handleViewAllClick}>
              {t('students_list.all')}
            </Button>
          </S.ListHeader>
          <Divider />
          <S.StudentsRow>
            {students.map(({ id, fullName }) => (
              <Col key={id} span={12}>
                <Space>
                  <S.AuthorAvatar>{fullName?.[0]}</S.AuthorAvatar>
                  <S.AuthorName>{fullName}</S.AuthorName>
                </Space>
              </Col>
            ))}
          </S.StudentsRow>
        </>
      )}
    </S.Wrapper>
  );
};

export default StudentsList;
