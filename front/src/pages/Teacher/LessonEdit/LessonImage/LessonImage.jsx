import { Col, Input, Row } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';

import * as S from './LessonImage.styled';

const MAX_IMAGE_LENGTH = 255;

const LessonImage = ({
  isLoading,
  image,
  setImage,
  imageError,
  setImageError,
  disabled,
}) => {
  const { t } = useTranslation('teacher');

  return (
    <Row gutter={[0, 8]}>
      <Col span={24}>{t('lesson_edit.cover_image.title')}</Col>
      <Col span={24}>
        <Input
          disabled={disabled}
          maxLength={MAX_IMAGE_LENGTH}
          allowClear
          value={image}
          placeholder={t('lesson_edit.cover_image.input_placeholder')}
          onChange={(e) => setImage(e.target.value)}
        />
      </Col>
      {isLoading === false && (
        <Col span={24}>
          {imageError ? (
            <S.ImageFallback>
              <S.ImageFallbackTitle>
                {t('lesson_edit.cover_image.not_found')}
              </S.ImageFallbackTitle>
              <ExclamationCircleOutlined />
            </S.ImageFallback>
          ) : (
            <S.Image
              onError={() => setImageError(true)}
              src={image.length === 0 ? DefaultLessonImage : image}
              alt="Lesson preview"
            />
          )}
        </Col>
      )}
    </Row>
  );
};

LessonImage.propTypes = {
  image: PropTypes.string,
  setImage: PropTypes.func,
  imageError: PropTypes.bool,
  setImageError: PropTypes.func,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default LessonImage;
