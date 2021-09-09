import { Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { AddCardPropTypes } from '../types';

import * as S from './AddCard.styled';

const AddCard = ({ onClick, titleKey }) => {
  const { t } = useTranslation('teacher');

  return (
    <S.Wrapper onClick={onClick}>
      <Space size="small" align="center">
        <S.Icon />
        <S.CardTitle>{t(titleKey)}</S.CardTitle>
      </Space>
    </S.Wrapper>
  );
};

AddCard.propTypes = AddCardPropTypes;

export default AddCard;
