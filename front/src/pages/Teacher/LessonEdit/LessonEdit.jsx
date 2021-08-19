import { Button, Col, Input, message, Modal, Row, Typography } from 'antd';
import DragDrop from 'editorjs-drag-drop';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { RedoOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';

import Header from '@sb-ui/components/molecules/Header';
import { Statuses } from '@sb-ui/pages/Teacher/Home/LessonsDashboard/constants';
import { queryClient } from '@sb-ui/query';
import {
  createLesson,
  getLesson,
  putLesson,
} from '@sb-ui/utils/api/v1/teacher';
import EditorJs from '@sb-ui/utils/editorjs/EditorJsContainer';
import Undo from '@sb-ui/utils/editorjs/undo-plugin';
import {
  LESSONS_EDIT,
  LESSONS_PREVIEW,
  TEACHER_LESSONS_STUDENTS,
} from '@sb-ui/utils/paths';
import { TEACHER_LESSON_BASE_KEY } from '@sb-ui/utils/queries';

import { getConfig, prepareBlocksForApi, prepareEditorData } from './utils';
import * as S from './LessonEdit.styled';

const { TextArea } = Input;

const MAX_NAME_LENGTH = 255;

const LessonEdit = () => {
  const { id: lessonId } = useParams();

  const isEditLesson = useMemo(() => lessonId !== 'new', []);
  const isCurrentlyEditing = lessonId !== 'new';

  const { t } = useTranslation('teacher');
  const history = useHistory();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isEditorDisabled, setIsEditorDisabled] = useState(false);

  const inputTitle = useRef(null);

  const editorJSRef = useRef(null);
  const [dataBlocks, setDataBlocks] = useState(null);
  const undoPluginRef = useRef(null);

  const { data: lessonData, isLoading } = useQuery(
    [TEACHER_LESSON_BASE_KEY, { id: lessonId }],
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
      if (editorJSRef.current && data) {
        const editorToRender = {
          blocks: prepareEditorData(data?.lesson?.blocks),
        };

        if (editorToRender.blocks.length === 0) {
          editorJSRef.current?.clear();
        } else {
          editorJSRef.current?.render?.(editorToRender);
        }
        undoPluginRef.current?.initialize(editorToRender);
      }
      queryClient.invalidateQueries([
        TEACHER_LESSON_BASE_KEY,
        { id: lessonId },
      ]);
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
    if (lessonData?.lesson.description) {
      setDescription(lessonData.lesson.description);
    }
  }, [lessonData?.lesson]);

  useEffect(() => {
    if (editorJSRef.current?.configuration && !isEditorDisabled) {
      undoPluginRef.current = new Undo({
        editor: editorJSRef.current,
        redoButton: 'redo-button',
        undoButton: 'undo-button',
      });
      // eslint-disable-next-line no-new
      new DragDrop(editorJSRef.current);
    }
  }, [isEditorDisabled]);

  useEffect(() => {
    if (lessonData) {
      setDataBlocks({
        blocks: prepareEditorData(lessonData?.lesson?.blocks),
      });
      if (!lessonData.lesson.status || lessonData?.lesson.status === 'Draft') {
        setIsEditorDisabled(false);
      } else {
        setIsEditorDisabled(true);
      }
    }
  }, [lessonData]);

  const handleSave = async () => {
    try {
      const { blocks } = await editorJSRef.current.save();
      const params = {
        lesson: {
          id: parseInt(lessonId, 10) || undefined,
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
      if (params.blocks.length === 0) {
        message.error({
          content: t('editor_js.message.error_empty_blocks'),
          duration: 2,
        });
        return;
      }

      if (isCurrentlyEditing) updateLessonMutation.mutate(params);
      else createLessonMutation.mutate(params);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Editor JS error: ', e);
    }
  };

  const { mutateAsync: updateLessonStatus, isLoading: isUpdateInProgress } =
    useMutation(putLesson, {
      onSuccess: () => {
        queryClient.invalidateQueries([
          TEACHER_LESSON_BASE_KEY,
          {
            id: lessonId,
          },
        ]);
      },
    });

  const handlePublish = async () => {
    await updateLessonStatus({
      lesson: { id: +lessonId, status: Statuses.PUBLIC },
    });
    Modal.success({
      width: 480,
      title: t('lesson_edit.publish_modal.title'),
      okText: t('lesson_edit.publish_modal.ok'),
    });
  };

  const handleDraft = async () => {
    await updateLessonStatus({
      lesson: { id: +lessonId, status: Statuses.DRAFT },
    });
  };

  const handleInputTitle = (e) => {
    const newText = e.target.value;
    if (newText.length < MAX_NAME_LENGTH) {
      setName(newText);
    }
  };

  const handleNextLine = (e) => {
    if (e.key === 'Enter') {
      editorJSRef.current?.focus?.();
    }
  };

  const handlePreview = () => {
    history.push(LESSONS_PREVIEW.replace(':id', lessonId));
  };

  const handleStudentsClick = () => {
    history.push(TEACHER_LESSONS_STUDENTS.replace(':id', lessonId));
  };

  return (
    <>
      <Header>
        <S.HeaderButtons>
          <Button disabled={!isEditLesson} onClick={handlePreview}>
            {t('lesson_edit.buttons.preview')}
          </Button>
          {lessonData?.lesson.status === Statuses.PUBLIC ? (
            <S.PublishButton
              type="primary"
              onClick={handleDraft}
              loading={isUpdateInProgress}
            >
              {t('lesson_edit.buttons.move_to_draft')}
            </S.PublishButton>
          ) : (
            <S.PublishButton
              type="primary"
              onClick={handlePublish}
              loading={isUpdateInProgress}
            >
              {t('lesson_edit.buttons.publish')}
            </S.PublishButton>
          )}
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
                readOnly={isEditorDisabled}
                onChange={handleInputTitle}
                onKeyDown={handleNextLine}
              />
              <S.BadgeWrapper>
                <S.CardBadge>
                  <S.StatusText>
                    {lessonData?.lesson.status
                      ? t(
                          `lesson_dashboard.status.${lessonData?.lesson.status.toLocaleLowerCase()}`,
                        )
                      : t('lesson_dashboard.status.draft')}
                  </S.StatusText>
                </S.CardBadge>
              </S.BadgeWrapper>
              {(!isEditLesson || dataBlocks) && (
                <EditorJs
                  tools={getConfig(t).tools}
                  data={dataBlocks}
                  readOnly={isEditorDisabled}
                  instanceRef={(instance) => {
                    editorJSRef.current = instance;
                  }}
                />
              )}
            </S.EditorWrapper>
          </S.LeftCol>
          <S.RightCol sm={12} md={10} lg={8} xl={6}>
            <S.RowStyled gutter={[32, 32]}>
              <Col span={24}>
                <S.SaveButton
                  onClick={handleSave}
                  disabled={isEditorDisabled}
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
              <S.StudentsCol span={24}>
                <S.TextLink onClick={handleStudentsClick} underline disabled={!isCurrentlyEditing}>
                  {t('lesson_edit.links.students')}
                </S.TextLink>
                <S.StudentsCount
                  showZero
                  count={lessonData?.lesson.studentsCount || 0}
                />
              </S.StudentsCol>
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
