import { Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { AddCardPropTypes } from '../types';

import * as S from './AddCard.styled';

const AddCard = ({ onClick, isCourse }) => {
  const { t } = useTranslation('teacher');
  const cardTitleKey = isCourse
    ? 'course_dashboard.add_button'
    : 'lesson_dashboard.add_button';

  return (
    <S.Wrapper onClick={onClick}>
      <Space size="small" align="center">
        <S.Icon />
        <S.CardTitle>{t(cardTitleKey)}</S.CardTitle>
      </Space>
    </S.Wrapper>
  );
};

AddCard.propTypes = AddCardPropTypes;

export default AddCard;
