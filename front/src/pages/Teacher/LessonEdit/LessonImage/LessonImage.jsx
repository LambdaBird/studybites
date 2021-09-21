import { Button, Col, Input, message, Row, Upload } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';

import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';
import { getJWTAccessToken } from '@sb-ui/utils/jwt';

import * as S from './LessonImage.styled';

const MAX_IMAGE_LENGTH = 255;

const LessonImage = ({
  isLoading,
  image,
  setImage,
  imageError,
  setImageError,
}) => {
  const { t } = useTranslation('teacher');

  const props = {
    name: 'file',
    action: 'http://localhost:3017/api/v1/files',
    headers: {
      Authorization: `Bearer ${getJWTAccessToken()}`,
    },
    onChange(info) {
      if (info?.file?.response?.location) {
        setImage(info.file.response.location);
      }
    },
  };

  return (
    <Row gutter={[0, 8]}>
      <Col span={24}>{t('lesson_edit.cover_image.title')}</Col>
      <Col span={24}>
        <Input
          maxLength={MAX_IMAGE_LENGTH}
          allowClear
          value={image}
          placeholder={t('lesson_edit.cover_image.input_placeholder')}
          onChange={(e) => setImage(e.target.value)}
        />
      </Col>
      <Col span={24}>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
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
};

export default LessonImage;
