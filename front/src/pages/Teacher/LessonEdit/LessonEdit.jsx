import { Button, Col, Input, message, Modal, Row } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { RedoOutlined, UndoOutlined } from '@ant-design/icons';

import Header from '@sb-ui/components/molecules/Header';
import InviteStudentsModal from '@sb-ui/components/molecules/InviteStudentsModal';
import KeywordsSelect from '@sb-ui/components/molecules/KeywordsSelect';
import { useLessonStatus } from '@sb-ui/hooks/useLessonStatus';
import { Statuses } from '@sb-ui/pages/Teacher/Home/Dashboard/constants';
import { convertStatusToTranslation } from '@sb-ui/pages/Teacher/LessonEdit/statusHelper';
import { queryClient } from '@sb-ui/query';
import {
  createLesson,
  getLesson,
  putLesson,
} from '@sb-ui/utils/api/v1/teacher';
import { sbPostfix } from '@sb-ui/utils/constants';
import EditorJs from '@sb-ui/utils/editorjs/EditorJsContainer';
import {
  LESSONS_EDIT,
  LESSONS_PREVIEW,
  TEACHER_LESSONS_STUDENTS,
} from '@sb-ui/utils/paths';
import { TEACHER_LESSON_BASE_KEY } from '@sb-ui/utils/queries';

import LessonImage from './LessonImage';
import { getConfig, prepareBlocksForApi, prepareEditorData } from './utils';
import * as S from './LessonEdit.styled';

const { TextArea } = Input;

const MAX_NAME_LENGTH = 255;
const HISTORY_POP = 'POP';

const LessonEdit = () => {
  const { id: lessonId } = useParams();
  const [isEditLesson] = useState(lessonId !== 'new');
  const isCurrentlyEditing = useMemo(() => lessonId !== 'new', [lessonId]);

  const { t, i18n } = useTranslation('teacher');
  const { language } = i18n;
  const history = useHistory();

  const { updateLessonStatusMutation, isUpdateInProgress } = useLessonStatus({
    id: lessonId,
  });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState(false);
  const [isEditorDisabled, setIsEditorDisabled] = useState(false);
  const [showInviteStudentsModal, setShowInviteStudentsModal] = useState(false);

  const inputTitle = useRef(null);
  const lastHistory = useRef(null);
  const navigationPermit = useRef(null);
  const [currentBlocks, setCurrentBlocks] = useState(null);
  const [isNavigationAllowed, setIsNavigationAllowed] = useState(true);
  const editorJSRef = useRef(null);
  const [dataBlocks, setDataBlocks] = useState(null);
  const undoPluginRef = useRef(null);
  const currentLocation = useMemo(
    () => LESSONS_EDIT.replace(':id', lessonId),
    [lessonId],
  );

  const { data: lessonData, isLoading } = useQuery(
    [TEACHER_LESSON_BASE_KEY, { id: lessonId }],
    getLesson,
    {
      enabled: isEditLesson,
    },
  );

  const [keywords, setKeywords] = useState([]);
  useEffect(() => {
    if (lessonData?.keywords) {
      setKeywords(
        lessonData.keywords.map((keyword) => ({
          value: keyword.id,
          label: keyword.name,
        })),
      );
    }
  }, [lessonData]);

  const createLessonMutation = useMutation(createLesson, {
    onSuccess: (data) => {
      const { id } = data?.lesson;
      history.replace(LESSONS_EDIT.replace(':id', id), { forceSkip: true });
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
      lastHistory.current = null;
      setIsNavigationAllowed(true);
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
    if (lessonData?.lesson.image) {
      setImage(lessonData.lesson.image);
    }
  }, [lessonData?.lesson]);

  const checkUnsaved = useCallback(
    ({
      onDiscard = () => {},
      onSettled = () => {},
      onSaved = () => {},
      onCancel = () => {},
    }) => {
      if (!isNavigationAllowed) {
        Modal.destroyAll();
        setTimeout(() => {
          Modal.confirm({
            title: t('lesson_edit.unsaved_modal.title'),
            content: t('lesson_edit.unsaved_modal.content'),
            okText: t('lesson_edit.unsaved_modal.ok_text'),
            cancelText: t('lesson_edit.unsaved_modal.cancel_text'),
            onOk: () => {
              onDiscard();
              onSaved();
            },
            onCancel: () => {
              onCancel();
            },
          });
        }, 50);

        return;
      }
      onSettled();
      onSaved();
    },
    [isNavigationAllowed, t],
  );

  useEffect(() => {
    if (lessonData) {
      const blocks = prepareEditorData(lessonData?.lesson?.blocks);
      setCurrentBlocks(blocks);
      setDataBlocks({
        blocks,
      });
      if (!lessonData.lesson.status || lessonData?.lesson.status === 'Draft') {
        setIsEditorDisabled(false);
      } else {
        setIsEditorDisabled(true);
      }
    }
  }, [lessonData]);

  useEffect(() => {
    setImageError(false);
  }, [image]);

  const handleSave = async () => {
    try {
      const { blocks } = await editorJSRef.current.save();
      const params = {
        lesson: {
          id: parseInt(lessonId, 10) || undefined,
          name,
          image,
          description,
          status: Statuses.DRAFT,
        },
        keywords: keywords.map((keyword) => ({
          name: keyword.label,
          id: typeof keyword.value === 'number' ? keyword.value : undefined,
        })),
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

  const isBlocksChanged = useCallback(() => {
    const oldBlocks = prepareEditorData(lessonData?.lesson?.blocks);
    // TODO: Compare with fast-deep-equal after adding this library
    return JSON.stringify(oldBlocks) !== JSON.stringify(currentBlocks);
  }, [currentBlocks, lessonData?.lesson?.blocks]);

  const handlePublish = async () => {
    checkUnsaved({
      onSaved: () => {
        updateLessonStatusMutation.mutate({
          id: lessonId,
          status: Statuses.PUBLIC,
        });
      },
    });
  };

  const handleDraft = async () => {
    updateLessonStatusMutation.mutate({ id: lessonId, status: Statuses.DRAFT });
  };

  const handleArchive = async () => {
    checkUnsaved({
      onSaved: () => {
        updateLessonStatusMutation.mutate({
          id: lessonId,
          status: Statuses.ARCHIVED,
        });
      },
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

  const isRenderEditor = useMemo(
    () => !isEditLesson || dataBlocks,
    [dataBlocks, isEditLesson],
  );

  const editorJsProps = useMemo(
    () => ({
      ref: undoPluginRef,
      tools: getConfig(t).tools,
      data: dataBlocks,
      language,
      instanceRef: (instance) => {
        editorJSRef.current = instance;
      },
      onChange: (api, blocks) => {
        setCurrentBlocks(blocks.blocks);
      },
    }),
    [dataBlocks, language, t],
  );

  const isArchived = useMemo(
    () => lessonData?.lesson?.status === Statuses.ARCHIVED,
    [lessonData?.lesson?.status],
  );

  const lessonStatusKey = useMemo(() => {
    const status = lessonData?.lesson?.status;
    const key = status ? convertStatusToTranslation(status) : 'draft';
    return `lesson_dashboard.status.${key}`;
  }, [lessonData?.lesson?.status]);

  useEffect(() => {
    if (isNavigationAllowed) {
      navigationPermit.current?.();
      const { location, action } = lastHistory.current || {};
      if (location) {
        lastHistory.current = null;
        if (action !== HISTORY_POP) {
          history.push({ ...location });
        } else {
          window.location.href = location.pathname;
        }
      }
    } else {
      if (navigationPermit.current) {
        navigationPermit.current?.();
      }
      navigationPermit.current = history.block((location, action) => {
        lastHistory.current = {
          location,
          action,
        };
        if (location?.state?.forceSkip) {
          return true;
        }
        if (action !== HISTORY_POP) {
          checkUnsaved({
            onDiscard: () => {
              setIsNavigationAllowed(true);
            },
          });
          return false;
        }
        if (action === HISTORY_POP) {
          checkUnsaved({
            onCancel: () => {
              window.history.pushState('', '', currentLocation);
            },
            onDiscard: () => {
              setIsNavigationAllowed(true);
            },
          });
          return false;
        }

        return true;
      });
    }

    return () => {
      navigationPermit.current?.();
    };
  }, [isNavigationAllowed, checkUnsaved, currentLocation, history]);

  useEffect(() => {
    if (isBlocksChanged()) {
      setIsNavigationAllowed(false);
    } else {
      lastHistory.current = null;
      setIsNavigationAllowed(true);
    }
  }, [currentBlocks, isBlocksChanged]);

  const handlerBeforeUnload = useCallback(
    (event) => {
      if (!isNavigationAllowed) {
        event.preventDefault();
        // eslint-disable-next-line no-param-reassign
        event.returnValue = '';
      }
    },
    [isNavigationAllowed],
  );

  useEffect(() => {
    window.addEventListener('beforeunload', handlerBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handlerBeforeUnload);
    };
  }, [isNavigationAllowed, handlerBeforeUnload, history]);

  return (
    <>
      <Helmet>
        <title>
          {isCurrentlyEditing
            ? t('pages.edit_lesson')
            : t('pages.create_lesson')}
          {sbPostfix}
        </title>
      </Helmet>
      <Header isFixed checkUnsaved={checkUnsaved}>
        <S.HeaderButtons>
          <Button disabled={!isCurrentlyEditing} onClick={handlePreview}>
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
      <InviteStudentsModal
        show={showInviteStudentsModal}
        setShow={setShowInviteStudentsModal}
      />
      <S.Page>
        <S.StyledRow align="top">
          <S.LeftCol>
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
                  <S.StatusText>{t(lessonStatusKey)}</S.StatusText>
                </S.CardBadge>
              </S.BadgeWrapper>
              {isRenderEditor && isEditorDisabled === true && (
                <EditorJs {...editorJsProps} readOnly />
              )}
              {isRenderEditor && isEditorDisabled === false && (
                <EditorJs {...editorJsProps} readOnly={false} />
              )}
            </S.EditorWrapper>
          </S.LeftCol>
          <S.RightCol>
            <S.RightColContent>
              <S.RowS>
                <S.SaveButton onClick={handleSave} disabled={isEditorDisabled}>
                  {t('lesson_edit.buttons.save')}
                </S.SaveButton>
                <S.UndoRedoWrapper>
                  <S.MoveButton
                    id="undo-button"
                    icon={<UndoOutlined />}
                    disabled={isEditorDisabled}
                  >
                    {t('lesson_edit.buttons.back')}
                  </S.MoveButton>
                  <S.MoveButton
                    id="redo-button"
                    icon={<RedoOutlined />}
                    disabled={isEditorDisabled}
                  >
                    {t('lesson_edit.buttons.forward')}
                  </S.MoveButton>
                </S.UndoRedoWrapper>
              </S.RowS>
              <S.RowStyled gutter={[0, 10]}>
                <Col span={24}>
                  <S.DisabledLink>
                    {t('lesson_edit.links.invite_collaborators')}
                  </S.DisabledLink>
                </Col>
                <Col span={24}>
                  <S.TextLink
                    underline
                    onClick={() => setShowInviteStudentsModal((prev) => !prev)}
                  >
                    {t('lesson_edit.links.invite_students')}
                  </S.TextLink>
                </Col>
                <S.StudentsCol span={24}>
                  <S.TextLink
                    onClick={handleStudentsClick}
                    underline
                    disabled={!isCurrentlyEditing}
                  >
                    {t('lesson_edit.links.students')}
                  </S.TextLink>
                  <S.StudentsCount
                    showZero
                    count={lessonData?.lesson.studentsCount || 0}
                  />
                </S.StudentsCol>
                <Col span={24}>
                  <S.DisabledLink>
                    {t('lesson_edit.links.analytics')}
                  </S.DisabledLink>
                </Col>
                <Col span={24}>
                  <S.DangerLink disabled={isArchived} onClick={handleArchive}>
                    {t('lesson_edit.links.archive')}
                  </S.DangerLink>
                </Col>
              </S.RowStyled>
              <S.LessonShareStyled />
              <Row gutter={[0, 8]}>
                <Col span={24}>{t('lesson_edit.description.title')}</Col>
                <Col span={24}>
                  <TextArea
                    disabled={isEditorDisabled}
                    value={description}
                    placeholder={t('lesson_edit.description.placeholder')}
                    onChange={(e) => setDescription(e.target.value)}
                    showCount
                    maxLength={140}
                  />
                </Col>
              </Row>
              <S.RowStyled gutter={[0, 16]}>
                <Col span={24}>Keywords</Col>
                <Col span={24}>
                  <KeywordsSelect
                    disabled={isEditorDisabled}
                    values={keywords}
                    setValues={setKeywords}
                  />
                </Col>
              </S.RowStyled>
              <LessonImage
                disabled={isEditorDisabled}
                image={image}
                setImage={setImage}
                imageError={imageError}
                setImageError={setImageError}
                isLoading={isLoading}
              />
            </S.RightColContent>
          </S.RightCol>
        </S.StyledRow>
      </S.Page>
    </>
  );
};

export default LessonEdit;
