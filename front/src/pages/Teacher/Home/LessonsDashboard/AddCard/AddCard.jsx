import { Space } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import * as S from './AddCard.styled';

const AddCard = ({ onClick }) => {
  const { t } = useTranslation('teacher');

  return (
    <S.Wrapper onClick={onClick}>
      <Space size="small" align="center">
        <S.Icon />
        <S.CardTitle>{t('lesson_dashboard.add_button')}</S.CardTitle>
      </Space>
    </S.Wrapper>
  );
};

AddCard.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddCard;
