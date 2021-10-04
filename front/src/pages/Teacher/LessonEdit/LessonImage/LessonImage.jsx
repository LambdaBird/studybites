import { Input, Row, Upload } from 'antd';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import DefaultLessonImage from '@sb-ui/resources/img/lesson.svg';
import api from '@sb-ui/utils/api';

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

  const uploadProps = useMemo(
    () => ({
      name: 'file',
      showUploadList: false,
      disabled,
      customRequest: async (data) => {
        try {
          const formData = new FormData();
          formData.append('file', data.file);

          const response = await api.post(
            `${process.env.REACT_APP_SB_HOST}/api/v1/files`,
            formData,
            {
              headers: {
                'content-type': 'multipart/form-data',
              },
            },
          );
          setImage(response.data.location);
        } catch (e) {
          setImageError(true);
        }
      },
    }),
    [disabled, setImage, setImageError],
  );

  return (
    <Row gutter={[0, 8]}>
      <S.Col>{t('lesson_edit.cover_image.title')}</S.Col>
      <S.Col>
        <Input
          disabled={disabled}
          maxLength={MAX_IMAGE_LENGTH}
          allowClear
          value={image}
          placeholder={t('lesson_edit.cover_image.input_placeholder')}
          onChange={(e) => setImage(e.target.value)}
        />
      </S.Col>
      <S.Col>
        <Upload {...uploadProps}>
          <S.UploadButton>{t('lesson_edit.buttons.upload')}</S.UploadButton>
        </Upload>
      </S.Col>
      {isLoading === false && (
        <S.Col>
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
        </S.Col>
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
