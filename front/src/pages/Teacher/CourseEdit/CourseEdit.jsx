import { Button, Col, Input, Row, Typography } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import { SaveOutlined } from '@ant-design/icons';

import Header from '@sb-ui/components/molecules/Header';
import CourseLesson from '@sb-ui/pages/Teacher/CourseEdit/CourseLesson';

import * as S from './CourseEdit.styled';

const { TextArea } = Input;

const MAX_NAME_LENGTH = 255;

const fetchLessons = async () => {
  return [
    {
      id: 1,
      name: 'Lesson 1',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. quod? consectetur adipisicing elit. quod',
      students: [{ id: 1, firstName: 'Test', lastName: 'Test' }],
    },
    {
      id: 2,
      name: 'Lesson 2',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. quod?  adipisicing elit. quod',
      students: [{ id: 1, firstName: 'Test', lastName: 'Test' }],
    },
    {
      id: 3,
      name: 'Lesson 3',

      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. quod? consectetur fyrert  adipisicing elit. quod',
      students: [{ id: 1, firstName: 'Test', lastName: 'Test' }],
    },
    {
      id: 4,
      name: 'Lesson 4',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. quod? consectetur adipisicing elit. quo asdfasdf d',
      students: [{ id: 1, firstName: 'Test', lastName: 'Test' }],
    },
  ];
};

const CourseEdit = () => {
  const { t } = useTranslation('teacher');
  const inputTitle = useRef(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const status = 'draft';

  const [lessonsAll, setLessonsAll] = useState([]);
  const [options, setOptions] = useState([]);
  const [lessons, setLessons] = useState([]);

  const handleSearch = async (search) => {
    const data = await fetchLessons({ search });
    setLessonsAll(data);
    setOptions(data.map((x) => ({ value: x.id, label: x.name })));
  };

  const [lessonsValue, setLessonsValue] = useState([]);

  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    handleSearch('');
  }, []);

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

  const removeLessonById = (id) => {
    setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
  };

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

  const handleInputTitle = (e) => {
    const newText = e.target.value;
    if (newText.length < MAX_NAME_LENGTH) {
      setName(newText);
    }
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

  return (
    <>
      <Header>
        <S.HeaderButtons>
          <S.PublishButton type="primary">
            {t('lesson_edit.buttons.publish')}
          </S.PublishButton>
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
                      {status
                        ? t(
                            `lesson_dashboard.status.${status.toLocaleLowerCase()}`,
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
                          options.length > 0) && <S.DivideLesson />,
                    )}
                  </S.DivideWrapper>
                </>
              )}
              <S.SelectWrapper>
                <S.Select
                  value={lessonsValue}
                  placeholder={t('course_edit.lesson_search.placeholder')}
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
                <S.SaveButton icon={<SaveOutlined />}>
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
              <Col span={24}>{t('lesson_edit.description')}</Col>
              <Col span={24}>
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
