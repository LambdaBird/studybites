import { Button, Col, Input, message, Row, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { SaveOutlined } from '@ant-design/icons';

import CourseLesson from '@sb-ui/components/lessonBlocks/Course';
import Header from '@sb-ui/components/molecules/Header';
import { Statuses } from '@sb-ui/pages/Teacher/Home/Dashboard/constants';

import { useCourse } from './useCourse';
import { useCourseParams } from './useCourseParams';
import * as S from './CourseEdit.styled';

const { TextArea } = Input;

const CourseEdit = () => {
  const { id: courseId } = useParams();
  const isEditCourse = useMemo(() => courseId !== 'new', []);
  const isCurrentlyEditing = courseId !== 'new';

  const { t } = useTranslation('teacher');

  const [search, setSearch] = useState('');
  const {
    courseData,
    createCourseMutation,
    updateCourseMutation,
    teacherLessons,
    handlePublish,
    handleDraft,
    isUpdateInProgress,
    isSaveButtonDisabled,
  } = useCourse({
    isEditCourse,
    courseId,
    search,
  });

  const [lessonsAll, setLessonsAll] = useState([]);
  const [options, setOptions] = useState([]);
  const [lessonsValue, setLessonsValue] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);

  const {
    handleInputTitle,
    inputTitle,
    name,
    description,
    handleChangeDescription,
  } = useCourseParams({
    course: courseData?.course,
  });

  useEffect(() => {
    if (courseData?.course?.lessons) {
      setLessons(courseData.course.lessons);
    }
  }, [courseData?.course.lessons]);

  const handleSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  useEffect(() => {
    if (teacherLessons) {
      setLessonsAll(teacherLessons);
      setOptions(teacherLessons.map((x) => ({ value: x.id, label: x.name })));
    }
  }, [teacherLessons]);

  const changeSelectOptions = useCallback(() => {
    setOptions(
      lessonsAll
        .filter((x) => !lessons.find((y) => y.id === x.id))
        .map((x) => ({
          label: x.name,
          value: x.id,
        })),
    );
  }, [lessons, lessonsAll]);

  const removeLessonById = useCallback((id) => {
    setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
  }, []);

  const handleAddLessonClick = () => {
    setLessons((prev) => {
      const newLessonsId = lessonsValue.filter((x) => !lessons.includes(x));
      return [
        ...prev,
        ...newLessonsId.map((id) =>
          lessonsAll.find((lesson) => lesson.id === id),
        ),
      ];
    });
    setLessonsValue([]);
  };

  const handleMouseLeaveCourse = () => {
    setCurrentLesson(null);
  };

  useEffect(() => {
    changeSelectOptions();
  }, [changeSelectOptions, lessons]);

  const handleSave = () => {
    const params = {
      course: {
        id: parseInt(courseId, 10) || undefined,
        name,
        description,
        status: Statuses.DRAFT,
      },
      lessons,
    };
    if (!name) {
      message.error({
        content: t('course_edit.message.error_course_name'),
        duration: 2,
      });
      return;
    }

    if (isCurrentlyEditing) {
      updateCourseMutation.mutate(params);
    } else {
      createCourseMutation.mutate(params);
    }
  };

  return (
    <>
      <Header hideOnScroll>
        <S.HeaderButtons>
          <Button disabled={!isCurrentlyEditing}>
            {t('lesson_edit.buttons.preview')}
          </Button>
          {courseData?.course?.status === Statuses.PUBLIC ? (
            <S.PublishButton onClick={handleDraft} loading={isUpdateInProgress}>
              {t('lesson_edit.buttons.move_to_draft')}
            </S.PublishButton>
          ) : (
            <S.PublishButton
              onClick={handlePublish}
              loading={isUpdateInProgress}
            >
              {t('lesson_edit.buttons.publish')}
            </S.PublishButton>
          )}
        </S.HeaderButtons>
      </Header>
      <S.Page>
        <S.StyledRow>
          <S.LeftCol>
            <S.EditorWrapper>
              <S.InputWrapper>
                <S.InputTitle
                  ref={inputTitle}
                  placeholder={t('course_edit.title.placeholder')}
                  value={name}
                  onChange={handleInputTitle}
                />
                <S.BadgeWrapper>
                  <S.CardBadge>
                    <S.StatusText>
                      {courseData?.course?.status
                        ? t(
                            `lesson_dashboard.status.${courseData?.course.status.toLocaleLowerCase()}`,
                          )
                        : t('lesson_dashboard.status.draft')}
                    </S.StatusText>
                  </S.CardBadge>
                </S.BadgeWrapper>
              </S.InputWrapper>
              <S.CourseWrapper onMouseLeave={handleMouseLeaveCourse}>
                {lessons?.map((lesson, index) => (
                  <S.CourseLessonWrapper key={lesson.id}>
                    <CourseLesson
                      onMouseEnter={() => {
                        setCurrentLesson(lesson.id);
                      }}
                      currentLesson={currentLesson}
                      removeLessonById={removeLessonById}
                      {...lesson}
                    />
                    {(index !== lessons.length - 1 ||
                      courseData?.course?.status === Statuses.DRAFT) && (
                      <S.DivideLesson />
                    )}
                  </S.CourseLessonWrapper>
                ))}
              </S.CourseWrapper>
              <S.SelectWrapper>
                <S.Select
                  value={lessonsValue}
                  placeholder={t('course_edit.lesson_search.placeholder')}
                  filterOption={false}
                  onSearch={handleSearch}
                  onChange={setLessonsValue}
                  options={options}
                />
                <Button type="primary" onClick={handleAddLessonClick}>
                  {t('lesson_dashboard.add_button')}
                </Button>
              </S.SelectWrapper>
            </S.EditorWrapper>
          </S.LeftCol>
          <S.RightCol>
            <S.RowStyled>
              <Col span={24}>
                <S.SaveButton
                  disabled={isSaveButtonDisabled}
                  onClick={handleSave}
                  icon={<SaveOutlined />}
                >
                  {t('lesson_edit.buttons.save')}
                </S.SaveButton>
              </Col>
            </S.RowStyled>
            <S.RowStyled gutter={[0, 10]}>
              <Col span={24}>
                <S.TextLink disabled underline>
                  {t('lesson_edit.links.invite')}
                </S.TextLink>
              </Col>
              <S.StudentsCol span={24}>
                <S.TextLink disabled underline>
                  {t('lesson_edit.links.students')}
                </S.TextLink>
                <S.StudentsCount showZero count={0} />
              </S.StudentsCol>
              <Col span={24}>
                <S.TextLink disabled underline>
                  {t('lesson_edit.links.analytics')}
                </S.TextLink>
              </Col>
              <Col span={24}>
                <Typography.Link disabled type="danger" underline>
                  {t('lesson_edit.links.archive')}
                </Typography.Link>
              </Col>
            </S.RowStyled>
            <Row gutter={[0, 16]}>
              <Col span={24}>{t('lesson_edit.description.title')}</Col>
              <Col span={24}>
                <TextArea
                  value={description}
                  placeholder={t('lesson_edit.description.placeholder')}
                  onChange={handleChangeDescription}
                  showCount
                  maxLength={140}
                />
              </Col>
            </Row>
          </S.RightCol>
        </S.StyledRow>
      </S.Page>
    </>
  );
};

export default CourseEdit;
