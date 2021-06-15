import { Button, Col, Input, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { RedoOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import Header from '@sb-ui/components/molecules/Header';
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

const LessonEdit = () => {
  const { t } = useTranslation();

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
              type="text"
              placeholder={t('lesson_edit.title.placeholder')}
              defaultValue={t('lesson_edit.title.default')}
            />
          </S.LeftCol>
          <S.RightCol span={7}>
            <RowStyled gutter={[32, 32]}>
              <Col span={24}>
                <SaveButton icon={<SaveOutlined />} type="primary" size="large">
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
                <TextArea showCount maxLength={140} />
              </Col>
            </Row>
          </S.RightCol>
        </S.StyledRow>
      </S.Page>
    </>
  );
};

export default LessonEdit;
