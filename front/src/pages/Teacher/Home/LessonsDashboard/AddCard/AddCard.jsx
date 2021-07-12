import { Space } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import variables from '@sb-ui/theme/variables';

import * as S from './AddCard.styled';

const AddCard = ({ onClick }) => {
  const { t } = useTranslation('teacher');

  return (
    <S.Wrapper onClick={onClick} justify="center" align="middle">
      <Space size="small" align="center">
        <S.Icon twoToneColor={variables['primary-color']} />
        <S.CardTitle>{t('lesson_dashboard.add_button')}</S.CardTitle>
      </Space>
    </S.Wrapper>
  );
};

AddCard.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddCard;
