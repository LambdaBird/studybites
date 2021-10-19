import { Button, Col, Input, message, Row } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { SaveOutlined } from '@ant-design/icons';

import Header from '@sb-ui/components/molecules/Header';
import KeywordsSelect from '@sb-ui/components/molecules/KeywordsSelect';
import { Statuses } from '@sb-ui/pages/Teacher/Home/Dashboard/constants';
import { sbPostfix } from '@sb-ui/utils/constants';

import CourseLesson from './CourseLesson';
import { useCourse } from './useCourse';
import { useCourseParams } from './useCourseParams';
import * as S from './CourseEdit.styled';

const { TextArea } = Input;

const CourseEdit = () => {
  const { id: courseId } = useParams();
  const isCurrentlyEditing = courseId !== 'new';
  // Invariant variable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isEditCourse = useMemo(() => isCurrentlyEditing, []);

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
    isButtonsDisabled,
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

  const swapLessons = (from, to) => {
    setLessons((prev) => {
      if (!prev[from] || !prev[to]) {
        return prev;
      }
      const newLessons = [...prev];
      const temp = newLessons[from];
      newLessons[from] = newLessons[to];
      newLessons[to] = temp;
      return newLessons;
    });
  };

  const moveTop = (id) => {
    const index = lessons.findIndex((lesson) => lesson.id === id);
    swapLessons(index, index - 1);
  };

  const moveBottom = (id) => {
    const index = lessons.findIndex((lesson) => lesson.id === id);
    swapLessons(index, index + 1);
  };

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

  const [keywords, setKeywords] = useState([]);
  useEffect(() => {
    if (courseData?.keywords) {
      setKeywords(
        courseData.keywords.map((keyword) => ({
          value: keyword.id,
          label: keyword.name,
        })),
      );
    }
  }, [courseData?.keywords]);

  const handleSave = () => {
    const params = {
      course: {
        id: parseInt(courseId, 10) || undefined,
        name,
        description,
        status: Statuses.DRAFT,
      },
      keywords: keywords.map((keyword) => ({
        name: keyword.label,
        id: typeof keyword.value === 'number' ? keyword.value : undefined,
      })),
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
      <Helmet>
        <title>
          {isCurrentlyEditing
            ? t('pages.edit_course')
            : t('pages.create_course')}
          {sbPostfix}
        </title>
      </Helmet>
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
              {lessons.length > 0 && (
                <>
                  <DndProvider backend={HTML5Backend}>
                    <S.CourseWrapper
                      onMouseLeave={handleMouseLeaveCourse}
                      showBottom={options.length > 0}
                    >
                      {lessons.map((lesson, index) => (
                        <S.CourseLessonWrapper key={lesson.id}>
                          <CourseLesson
                            onMouseEnter={() => {
                              setCurrentLesson(lesson.id);
                            }}
                            currentLesson={currentLesson}
                            swapLessons={swapLessons}
                            moveTop={moveTop}
                            removeLessonById={removeLessonById}
                            moveBottom={moveBottom}
                            index={index}
                            {...lesson}
                          />
                        </S.CourseLessonWrapper>
                      ))}
                    </S.CourseWrapper>
                  </DndProvider>
                  <S.DivideWrapper>
                    {lessons.map(
                      (x, index) =>
                        (index !== lessons.length - 1 ||
                          courseData?.course?.status === Statuses.DRAFT) && (
                          <S.DivideLesson />
                        ),
                    )}
                  </S.DivideWrapper>
                </>
              )}
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
                  disabled={isButtonsDisabled}
                  onClick={handleSave}
                  icon={<SaveOutlined />}
                >
                  {t('lesson_edit.buttons.save')}
                </S.SaveButton>
              </Col>
            </S.RowStyled>
            <S.RowStyled gutter={[0, 10]}>
              <Col span={24}>
                <S.DisabledLink>{t('lesson_edit.links.invite')}</S.DisabledLink>
              </Col>
              <S.StudentsCol span={24}>
                <S.DisabledLink>
                  {t('lesson_edit.links.students')}
                </S.DisabledLink>
                <S.StudentsCount showZero count={0} />
              </S.StudentsCol>
              <Col span={24}>
                <S.DisabledLink>
                  {t('lesson_edit.links.analytics')}
                </S.DisabledLink>
              </Col>
              <Col span={24}>
                <S.DisabledLink type="danger">
                  {t('lesson_edit.links.archive')}
                </S.DisabledLink>
              </Col>
            </S.RowStyled>
            <Row gutter={[0, 16]}>
              <Col span={24}>{t('lesson_edit.description.title')}</Col>
              <Col span={24}>
                <TextArea
                  value={description}
                  disabled={isButtonsDisabled}
                  placeholder={t('lesson_edit.description.placeholder')}
                  onChange={handleChangeDescription}
                  showCount
                  maxLength={140}
                />
              </Col>
            </Row>
            <Row gutter={[0, 16]}>
              <Col span={24}>{t('course_edit.keywords')}</Col>
              <Col span={24}>
                <KeywordsSelect
                  disabled={isButtonsDisabled}
                  values={keywords}
                  setValues={setKeywords}
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
