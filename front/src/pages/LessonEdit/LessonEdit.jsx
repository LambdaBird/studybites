import { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { Button, Col, Input, Row, Typography, message } from 'antd';
import hash from 'object-hash';
import { useTranslation } from 'react-i18next';
import EditorJS from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import HeaderTool from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import Marker from '@editorjs/marker';
import Table from 'editorjs-table';
import DragDrop from 'editorjs-drag-drop';
import SimpleImage from '@editorjs/simple-image';
import { RedoOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import Header from '@sb-ui/components/molecules/Header';
import { createLesson, getLesson, putLesson } from '@sb-ui/utils/api/v1/lesson';
import { Statuses } from '@sb-ui/pages/TeacherHome/LessonsDashboard/constants';
import { LESSONS_EDIT } from '@sb-ui/utils/paths';
import Next from '@sb-ui/utils/editorjs/next-plugin';
import Quiz from '@sb-ui/utils/editorjs/quiz-plugin';
import Undo from '@sb-ui/utils/editorjs/undo-plugin';

import {
  prepareApiData,
  prepareEditorData,
  QUIZ_TYPE,
} from '@sb-ui/pages/LessonEdit/utils';

import * as S from './LessonEdit.styled';

const { TextArea } = Input;

const GET_LESSON_BASE_QUERY = 'getLesson';

const LessonEdit = () => {
  const { t } = useTranslation();
  const { id: lessonId } = useParams();
  const isEditLesson = !!lessonId;
  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editorReady, setEditorReady] = useState(false);
  const editorJSref = useRef(null);
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
      onReady: () => {
        // eslint-disable-next-line no-new
        undoPluginRef.current = new Undo({
          editor: editorJSref.current,
          redoButton: 'redo-button',
          undoButton: 'undo-button',
        });
        // eslint-disable-next-line no-new
        new DragDrop(editorJSref.current);
        setEditorReady(true);
      },
      tools: {
        image: SimpleImage,
        next: Next,
        quiz: Quiz,
        embed: Embed,
        header: HeaderTool,
        list: List,
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
  }, [t]);

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

  useEffect(() => {
    if (editorReady && lessonData) {
      const editorToRender = {
        blocks: prepareEditorData(lessonData?.lesson?.blocks),
      };

      if (editorToRender.blocks.length === 0) {
        editorJSref.current.clear();
      } else {
        editorJSref.current.render?.(editorToRender);
      }
      undoPluginRef.current.initialize(editorToRender);
    }
  }, [editorReady, lessonData]);

  const { mutate } = useMutation(createLesson, {
    onSuccess: (data) => {
      const { id } = data?.lesson;
      history.push(LESSONS_EDIT.replace(':id', id));
    },
    onError: (e) => {
      message.error({
        content: e.message,
        key: e.key,
        duration: 2,
      });
    },
  });

  const { mutate: updateLesson } = useMutation(putLesson, {
    onError: (e) => {
      message.error({
        content: e.message,
        key: e.key,
        duration: 2,
      });
    },
  });

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
      // eslint-disable-next-line no-unused-expressions
      isEditLesson ? updateLesson(params) : mutate(params);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Editor JS error: ', e);
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
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleNextLine}
              />
              <div id="editorjs" />
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
