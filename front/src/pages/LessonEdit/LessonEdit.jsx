import { useEffect, useRef, useState } from 'react';
import { Button, Col, Input, Row, Typography, message } from 'antd';
import hash from 'object-hash';
import { useTranslation } from 'react-i18next';
import EditorJS from '@editorjs/editorjs';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { RedoOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import Header from '@sb-ui/components/molecules/Header';
import { createLesson, getLesson, putLesson } from '@sb-ui/utils/api/v1/lesson';
import { Statuses } from '@sb-ui/pages/TeacherHome/LessonsDashboard/constants';
import { LESSONS_EDIT } from '@sb-ui/utils/paths';
// import Next from '@sb-ui/utils/next-plugin/next';
import Next from '@sb-ui/utils/next-plugin/next';
import * as S from './LessonEdit.styled';

const { TextArea } = Input;

let editorJS;
let undo;

const GET_LESSON_BASE_QUERY = 'getLesson';

const LessonEdit = () => {
  const { t } = useTranslation();
  const { id: lessonId } = useParams();
  const isEditLesson = !!lessonId;
  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editorData, setEditorData] = useState(null);
  const [editorReady, setEditorReady] = useState(false);

  const inputTitle = useRef(null);

  useEffect(() => {
    editorJS = new EditorJS({
      holder: 'editorjs',
      onReady: () => {
        // eslint-disable-next-line no-new
        undo = new Undo({ editor: editorJS });
        // eslint-disable-next-line no-new
        new DragDrop(editorJS);
        setEditorReady(true);
      },
      tools: {
        next: Next,
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
    inputTitle.current.focus();
  }, []);

  useEffect(() => {
    if (editorReady && editorData) {
      const {
        lesson: { blocks },
      } = editorData;
      const editorToRender = {
        blocks: blocks.map(({ content }) => content),
      };

      if (editorToRender.blocks.length === 0) {
        editorJS.clear();
      } else {
        editorJS.render?.(editorToRender);
      }
      undo.initialize(editorToRender);
    }
  }, [editorReady, editorData]);

  useQuery(
    [
      GET_LESSON_BASE_QUERY,
      {
        id: lessonId,
      },
    ],
    getLesson,
    {
      enabled: !!lessonId,
      onSuccess: (data) => {
        setEditorData(data);
      },
    },
  );

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
    onSuccess: (data) => {
      setEditorData(data);
    },
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
      const { blocks } = await editorJS.save();
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
              data,
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
      editorJS.focus();
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
                <S.MoveButton icon={<UndoOutlined />} size="medium">
                  {t('lesson_edit.buttons.back')}
                </S.MoveButton>
              </Col>
              <Col span={12}>
                <S.MoveButton icon={<RedoOutlined />} size="medium">
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
