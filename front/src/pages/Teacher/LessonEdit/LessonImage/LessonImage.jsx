import { Col, Input, Row, Upload } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';

import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';
import { getJWTAccessToken } from '@sb-ui/utils/jwt';

import * as S from './LessonImage.styled';

const MAX_IMAGE_LENGTH = 255;
const PATH = '/api/v1/files';

const LessonImage = ({
  isLoading,
  image,
  setImage,
  imageError,
  setImageError,
  disabled,
}) => {
  const { t } = useTranslation('teacher');

  const uploadProps = {
    name: 'file',
    showUploadList: false,
    action: PATH,
    headers: {
      authorization: `Bearer ${getJWTAccessToken()}`,
    },
    onChange(data) {
      if (data?.file?.response?.location) {
        setImage(data.file.response.location);
      }
    },
  };

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
      <Col span={24}>
        <Upload {...uploadProps}>
          <S.UploadButton icon={<UploadOutlined />}>
            {t('lesson_edit.buttons.upload')}
          </S.UploadButton>
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
  disabled: PropTypes.bool,
};

export default LessonImage;
