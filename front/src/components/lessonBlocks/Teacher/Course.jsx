import { Avatar, Dropdown, Menu, Space, Tooltip, Typography } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { EllipsisOutlined } from '@ant-design/icons';

import { StyledAvatar } from '@sb-ui/components/molecules/Header/Header.styled';
import { useCoursePublish } from '@sb-ui/hooks/useCoursePublish';
import { Statuses } from '@sb-ui/pages/Teacher/Home/Dashboard/constants';
import lesson from '@sb-ui/resources/img/lesson.svg';
import { COURSES_EDIT } from '@sb-ui/utils/paths';

import { TeacherPropTypes } from './types';
import * as S from './Lesson.styled';

const { Text } = Typography;

const STATUS_KEYS = {
  ARCHIVE: 'archiveCourse',
  PUBLISH: 'publishCourse',
  DRAFT: 'draftCourse',
  RESTORE: 'restoreCourse',
};

const menuItems = {
  [Statuses.DRAFT]: [
    { key: STATUS_KEYS.PUBLISH, labelKey: 'course_dashboard.menu.publish' },
    {
      key: STATUS_KEYS.ARCHIVE,
      labelKey: 'course_dashboard.menu.archive',
      isDanger: true,
    },
  ],
  [Statuses.PUBLIC]: [
    { key: STATUS_KEYS.DRAFT, labelKey: 'course_dashboard.menu.draft' },
    {
      key: STATUS_KEYS.ARCHIVE,
      labelKey: 'course_dashboard.menu.archive',
      isDanger: true,
    },
  ],
  [Statuses.ARCHIVED]: [
    { key: STATUS_KEYS.RESTORE, labelKey: 'course_dashboard.menu.restore' },
  ],
};

const Course = ({ name, id, students: studentsData, status, lessons }) => {
  const history = useHistory();

  const { t } = useTranslation('teacher');

  const { handlePublish, handleDraft, updateCourseStatus } = useCoursePublish({
    lessons,
    courseId: id,
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
    switch (key) {
      case STATUS_KEYS.ARCHIVE:
        updateCourseStatus({
          course: { id, status: Statuses.ARCHIVED },
        });
        break;
      case STATUS_KEYS.PUBLISH:
        handlePublish();
        break;
      case STATUS_KEYS.RESTORE:
      case STATUS_KEYS.DRAFT:
        handleDraft();
        break;
      default:
        break;
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
