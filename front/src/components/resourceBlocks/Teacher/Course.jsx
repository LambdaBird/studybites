import { Avatar, Dropdown, Menu, Space, Tooltip, Typography } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import { EllipsisOutlined } from '@ant-design/icons';

import { StyledAvatar } from '@sb-ui/components/molecules/Header/Header.styled';
import { Statuses } from '@sb-ui/pages/Teacher/Home/Dashboard/constants';
import { queryClient } from '@sb-ui/query';
import lesson from '@sb-ui/resources/img/lesson.svg';
import { putCourse } from '@sb-ui/utils/api/v1/courses-management';
import { COURSES_EDIT } from '@sb-ui/utils/paths';
import { TEACHER_COURSES_BASE_KEY } from '@sb-ui/utils/queries';

import { TeacherPropTypes } from './types';
import * as S from './Lesson.styled';

const { Text } = Typography;

const menuItems = {
  [Statuses.DRAFT]: [
    { key: 'publishCourse', labelKey: 'course_dashboard.menu.publish' },
    {
      key: 'archiveCourse',
      labelKey: 'course_dashboard.menu.archive',
      isDanger: true,
    },
  ],
  [Statuses.PUBLIC]: [
    { key: 'draftCourse', labelKey: 'course_dashboard.menu.draft' },
    {
      key: 'archiveCourse',
      labelKey: 'course_dashboard.menu.archive',
      isDanger: true,
    },
  ],
  [Statuses.ARCHIVED]: [
    { key: 'restoreCourse', labelKey: 'course_dashboard.menu.restore' },
  ],
};

const Course = ({ name, id, students: studentsData, status }) => {
  const history = useHistory();

  const { t } = useTranslation('teacher');
  const updateCourseMutation = useMutation(putCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries(TEACHER_COURSES_BASE_KEY);
    },
  });

  const students = useMemo(
    () =>
      studentsData.map(({ id: studentId, firstName = '', lastName = '' }) => ({
        id: studentId,
        name: `${firstName} ${lastName}`,
      })),
    [studentsData],
  );

  const handleMenuClick = ({ key }) => {
    if (key === 'archiveCourse') {
      updateCourseMutation.mutate({
        course: { id, status: Statuses.ARCHIVED },
      });
    }
    if (key === 'publishCourse') {
      updateCourseMutation.mutate({ course: { id, status: Statuses.PUBLIC } });
    }
    if (key === 'restoreCourse') {
      updateCourseMutation.mutate({ course: { id, status: Statuses.DRAFT } });
    }
    if (key === 'draftCourse') {
      updateCourseMutation.mutate({ course: { id, status: Statuses.DRAFT } });
    }
  };

  const handleEdit = () => {
    history.push(COURSES_EDIT.replace(':id', id));
  };

  const menu = () => (
    <Menu onClick={handleMenuClick}>
      {menuItems[status].map((menuItem) => (
        <Menu.Item danger={menuItem.isDanger} key={menuItem.key}>
          {t(menuItem.labelKey)}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <S.Wrapper justify="center" align="middle">
      <S.ImageCol span={8}>
        <S.BadgeWrapper>
          <S.CardBadge>
            <S.StatusText>
              {t(`lesson_dashboard.status.${status.toLocaleLowerCase()}`)}
            </S.StatusText>
          </S.CardBadge>
        </S.BadgeWrapper>
        <S.CardImage src={lesson} />
      </S.ImageCol>
      <S.CardDescription span={16}>
        <S.CardText>
          <S.TitleEllipsis>{name}</S.TitleEllipsis>
          {!students.length ? (
            <Text type="secondary">
              {t('lesson_dashboard.card.no_students')}
            </Text>
          ) : (
            <Space>
              <Avatar.Group>
                {students.slice(0, 3).map((el) => (
                  <Tooltip key={el.id} title={el.name} placement="top">
                    {el.avatar ? (
                      <Avatar src={el.avatar} />
                    ) : (
                      <StyledAvatar>{el.name?.[0]}</StyledAvatar>
                    )}
                  </Tooltip>
                ))}
              </Avatar.Group>
              <Text type="secondary">
                {students.length} {t('lesson_dashboard.card.students')}
              </Text>
            </Space>
          )}
        </S.CardText>
        <S.ActionsWrapper>
          <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <EllipsisOutlined />
          </Dropdown>
          <S.CardButton onClick={handleEdit}>
            {t('lesson_dashboard.card.edit')}
          </S.CardButton>
        </S.ActionsWrapper>
      </S.CardDescription>
    </S.Wrapper>
  );
};

Course.propTypes = TeacherPropTypes;

Course.defaultProps = {
  students: [],
};

export default Course;
