import { Button, Col, Input, message, Row, Typography } from 'antd';
import DragDrop from 'editorjs-drag-drop';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { RedoOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import EditorJS from '@editorjs/editorjs';

import Header from '@sb-ui/components/molecules/Header';
import { Statuses } from '@sb-ui/pages/Teacher/Home/LessonsDashboard/constants';
import {
  createLesson,
  getLesson,
  putLesson,
} from '@sb-ui/utils/api/v1/teacher';
import Undo from '@sb-ui/utils/editorjs/undo-plugin';
import { LESSONS_EDIT } from '@sb-ui/utils/paths';
import { TEACHER_LESSON_BASE_KEY } from '@sb-ui/utils/queries';

import { getConfig, prepareBlocksForApi, prepareEditorData } from './utils';
import * as S from './LessonEdit.styled';

const { TextArea } = Input;

const MAX_NAME_LENGTH = 255;

const LessonEdit = () => {
  const { id: lessonId } = useParams();
  const isEditLesson = !!lessonId;

  const { t } = useTranslation('teacher');
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
      TEACHER_LESSON_BASE_KEY,
      {
        id: lessonId,
      },
    ],
    getLesson,
    {
      enabled: isEditLesson,
    },
  );

  const createLessonMutation = useMutation(createLesson, {
    onSuccess: (data) => {
      const { id } = data?.lesson;
      history.replace(LESSONS_EDIT.replace(':id', id));
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

  const updateLessonMutation = useMutation(putLesson, {
    onSuccess: (data) => {
      if (editorReady && data) {
        const editorToRender = {
          blocks: prepareEditorData(data?.lesson?.blocks),
        };

        if (editorToRender.blocks.length === 0) {
          editorJSref.current.clear();
        } else {
          editorJSref.current.render?.(editorToRender);
        }
        undoPluginRef.current.initialize(editorToRender);
      }
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
  });

  useEffect(() => {
    editorJSref.current = new EditorJS(getConfig(t));
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
        blocks: prepareBlocksForApi(blocks),
      };

      if (!name) {
        message.error({
          content: t('editor_js.message.error_lesson_name'),
          duration: 2,
        });
        return;
      }

      if (isEditLesson) updateLessonMutation.mutate(params);
      else createLessonMutation.mutate(params);
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
