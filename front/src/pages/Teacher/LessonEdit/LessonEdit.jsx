import { Button, Col, Input, message, Row, Typography } from 'antd';
import DragDrop from 'editorjs-drag-drop';
import Table from 'editorjs-table';
import hash from 'object-hash';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { RedoOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import Delimiter from '@editorjs/delimiter';
import EditorJS from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import HeaderTool from '@editorjs/header';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import SimpleImage from '@editorjs/simple-image';

import Header from '@sb-ui/components/molecules/Header';
import { Statuses } from '@sb-ui/pages/Teacher/Home/LessonsDashboard/constants';
import {
  prepareApiData,
  prepareEditorData,
  QUIZ_TYPE,
} from '@sb-ui/pages/Teacher/LessonEdit/utils';
import {
  createLesson,
  getLesson,
  putLesson,
} from '@sb-ui/utils/api/v1/teacher';
import Next from '@sb-ui/utils/editorjs/next-plugin';
import Quiz from '@sb-ui/utils/editorjs/quiz-plugin';
import Undo from '@sb-ui/utils/editorjs/undo-plugin';
import { LESSONS_EDIT } from '@sb-ui/utils/paths';

import * as S from './LessonEdit.styled';

const { TextArea } = Input;

const GET_LESSON_BASE_QUERY = 'getLesson';
const MAX_NAME_LENGTH = 255;

const LessonEdit = () => {
  const { t } = useTranslation('teacher');
  const { id: lessonId } = useParams();
  const isEditLesson = !!lessonId;
  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editorReady, setEditorReady] = useState(false);
  const editorJSref = useRef(null);
  const editorContainerRef = useRef(null);
  const undoPluginRef = useRef(null);

  const inputTitle = useRef(null);

  const { data: lessonData, isLoading } = useQuery(
    [
      GET_LESSON_BASE_QUERY,
      {
        id: lessonId,
      },
    ],
    getLesson,
    {
      enabled: !!lessonId,
    },
  );

  useEffect(() => {
    editorJSref.current = new EditorJS({
      holder: 'editorjs',
      tools: {
        image: SimpleImage,
        next: Next,
        quiz: Quiz,
        embed: Embed,
        header: {
          class: HeaderTool,
          config: {
            placeholder: t('editor_js.header.placeholder'),
            levels: [1, 2, 3, 4, 5],
            defaultLevel: 3,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        quote: Quote,
        delimiter: Delimiter,
        marker: Marker,
        table: Table,
      },
      i18n: {
        messages: {
          ui: {
            toolbar: {
              toolbox: {
                Add: t('editor_js.toolbar.toolbox_add'),
              },
            },
          },
          toolNames: {
            Text: t('editor_js.tool_names.text'),
            Next: t('editor_js.tool_names.next'),
          },
        },
      },
      plugins: [],
    });

    editorJSref.current.isReady.then(() => {
      setEditorReady(true);
    });
  }, [t]);

  useEffect(() => {
    if (editorReady && editorContainerRef.current) {
      undoPluginRef.current = new Undo({
        editor: editorJSref.current,
        redoButton: 'redo-button',
        undoButton: 'undo-button',
      });
      // eslint-disable-next-line no-new
      new DragDrop(editorJSref.current);
    }
  }, [editorReady, editorContainerRef]);

  useEffect(() => {
    if (inputTitle.current && !isLoading && !lessonData?.lesson.name) {
      setTimeout(() => {
        inputTitle.current.focus();
      }, 0);
    }
  }, [inputTitle, isLoading, lessonData?.lesson.name]);

  useEffect(() => {
    if (lessonData?.lesson.name) {
      setName(lessonData.lesson.name);
    }
  }, [lessonData?.lesson.name]);

  const { mutate } = useMutation(createLesson, {
    onSuccess: (data) => {
      const { id } = data?.lesson;
      history.push(LESSONS_EDIT.replace(':id', id));
      message.success({
        content: t('editor_js.message.success_created'),
        duration: 2,
      });
    },
    onError: () => {
      message.error({
        content: t('editor_js.message.error_created'),
        duration: 2,
      });
    },
  });

  const { mutate: updateLesson, data: updatedLessonData } = useMutation(
    putLesson,
    {
      onSuccess: () => {
        message.success({
          content: t('editor_js.message.success_updated'),
          duration: 2,
        });
      },
      onError: () => {
        message.error({
          content: t('editor_js.message.error_updated'),
          duration: 2,
        });
      },
    },
  );

  useEffect(() => {
    if (editorReady && (lessonData || updatedLessonData)) {
      const editorToRender = {
        blocks: prepareEditorData(
          updatedLessonData?.lesson?.blocks || lessonData?.lesson?.blocks,
        ),
      };

      if (editorToRender.blocks.length === 0) {
        editorJSref.current.clear();
      } else {
        editorJSref.current.render?.(editorToRender);
      }
      undoPluginRef.current.initialize(editorToRender);
    }
  }, [editorReady, lessonData, updatedLessonData]);

  const handleSave = async () => {
    try {
      const { blocks } = await editorJSref.current.save();
      const params = {
        lesson: {
          id: lessonId,
          name,
          description,
          status: Statuses.DRAFT,
        },
        blocks: blocks.map((block) => {
          const { id, type, data } = block;
          return {
            type,
            revision: hash(block),
            content: {
              id,
              type,
              data: prepareApiData(data, type),
            },
            answer: {
              results:
                type === QUIZ_TYPE
                  ? block?.data?.answers?.map((x) => x.correct)
                  : undefined,
            },
          };
        }),
      };

      if (!name) {
        message.error({
          content: t('editor_js.message.error_lesson_name'),
          duration: 2,
        });
        return;
      }
      // eslint-disable-next-line no-unused-expressions
      isEditLesson ? updateLesson(params) : mutate(params);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Editor JS error: ', e);
    }
  };

  const handleInputTitle = (e) => {
    const newText = e.target.value;
    if (newText.length < MAX_NAME_LENGTH) {
      setName(newText);
    }
  };

  const handleNextLine = (e) => {
    if (e.key === 'Enter') {
      editorJSref.current.focus();
    }
  };

  return (
    <>
      <Header>
        <S.HeaderButtons>
          <Button>{t('lesson_edit.buttons.preview')}</Button>
          <S.PublishButton type="primary">
            {t('lesson_edit.buttons.publish')}
          </S.PublishButton>
        </S.HeaderButtons>
      </Header>
      <S.Page>
        <S.StyledRow align="top">
          <S.LeftCol sm={12} md={14} lg={16} xl={18}>
            <S.EditorWrapper>
              <S.InputTitle
                ref={inputTitle}
                type="text"
                placeholder={t('lesson_edit.title.placeholder')}
                value={name}
                onChange={handleInputTitle}
                onKeyDown={handleNextLine}
              />
              <div id="editorjs" ref={editorContainerRef} />
            </S.EditorWrapper>
          </S.LeftCol>
          <S.RightCol sm={12} md={10} lg={8} xl={6}>
            <S.RowStyled gutter={[32, 32]}>
              <Col span={24}>
                <S.SaveButton
                  onClick={handleSave}
                  icon={<SaveOutlined />}
                  type="primary"
                  size="large"
                >
                  {t('lesson_edit.buttons.save')}
                </S.SaveButton>
              </Col>
              <Col span={12}>
                <S.MoveButton
                  id="undo-button"
                  icon={<UndoOutlined />}
                  size="medium"
                >
                  {t('lesson_edit.buttons.back')}
                </S.MoveButton>
              </Col>
              <Col span={12}>
                <S.MoveButton
                  id="redo-button"
                  icon={<RedoOutlined />}
                  size="medium"
                >
                  {t('lesson_edit.buttons.forward')}
                </S.MoveButton>
              </Col>
            </S.RowStyled>
            <S.RowStyled gutter={[0, 10]}>
              <Col span={24}>
                <S.TextLink underline>
                  {t('lesson_edit.links.invite')}
                </S.TextLink>
              </Col>
              <Col span={24}>
                <S.TextLink underline>
                  {t('lesson_edit.links.students')}
                </S.TextLink>
                <S.StudentsCount showZero count={4} />
              </Col>
              <Col span={24}>
                <S.TextLink underline>
                  {t('lesson_edit.links.analytics')}
                </S.TextLink>
              </Col>
              <Col span={24}>
                <Typography.Link type="danger" underline>
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

export default LessonEdit;
