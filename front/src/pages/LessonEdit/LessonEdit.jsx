import { useEffect, useRef, useState } from 'react';
import { Button, Col, Input, Row, Typography, message } from 'antd';
import hash from 'object-hash';
import { useTranslation } from 'react-i18next';
import EditorJS from '@editorjs/editorjs';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import { useMutation, useQuery } from 'react-query';
import { RedoOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import Header from '@sb-ui/components/molecules/Header';
import { createLesson, getLesson, putLesson } from '@sb-ui/utils/api/v1/lesson';
import { Statuses } from '@sb-ui/pages/TeacherHome/LessonsDashboard/constants';
import { LESSONS_EDIT } from '@sb-ui/utils/paths';
import { useHistory, useParams } from 'react-router-dom';
import * as S from './LessonEdit.styled';
import {
  HeaderButtons,
  InputTitle,
  MoveButton,
  PublishButton,
  RowStyled,
  SaveButton,
  StudentsCount,
  TextLink,
} from './LessonEdit.styled';

const { TextArea } = Input;

let editorJS;
let undo;

const GET_LESSON_BASE_QUERY = 'getLesson';

const LessonEdit = () => {
  const { t } = useTranslation();
  const { id: lessonId } = useParams();
  const isEditLesson = !!lessonId;
  const history = useHistory();
  const [name, setName] = useState(t('lesson_edit.title.default'));
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
      console.error('Editor JS error: ', e);
    }
  };

  return (
    <>
      <Header>
        <HeaderButtons>
          <Button>{t('lesson_edit.buttons.preview')}</Button>
          <PublishButton type="primary">
            {t('lesson_edit.buttons.publish')}
          </PublishButton>
        </HeaderButtons>
      </Header>
      <S.Page>
        <S.StyledRow align="top">
          <S.LeftCol span={12}>
            <InputTitle
              ref={inputTitle}
              type="text"
              placeholder={t('lesson_edit.title.placeholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div id="editorjs" />
          </S.LeftCol>
          <S.RightCol span={12}>
            <RowStyled gutter={[32, 32]}>
              <Col span={24}>
                <SaveButton
                  onClick={handleSave}
                  icon={<SaveOutlined />}
                  type="primary"
                  size="large"
                >
                  {t('lesson_edit.buttons.save')}
                </SaveButton>
              </Col>
              <Col span={12}>
                <MoveButton icon={<UndoOutlined />} size="medium">
                  {t('lesson_edit.buttons.back')}
                </MoveButton>
              </Col>
              <Col span={12}>
                <MoveButton icon={<RedoOutlined />} size="medium">
                  {t('lesson_edit.buttons.forward')}
                </MoveButton>
              </Col>
            </RowStyled>
            <RowStyled gutter={[0, 10]}>
              <Col span={24}>
                <TextLink underline>{t('lesson_edit.links.invite')}</TextLink>
              </Col>
              <Col span={24}>
                <TextLink underline>{t('lesson_edit.links.students')}</TextLink>
                <StudentsCount showZero count={4} />
              </Col>
              <Col span={24}>
                <TextLink underline>
                  {t('lesson_edit.links.analytics')}
                </TextLink>
              </Col>
              <Col span={24}>
                <Typography.Link type="danger" underline>
                  {t('lesson_edit.links.archive')}
                </Typography.Link>
              </Col>
            </RowStyled>
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
