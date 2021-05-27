import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Space } from 'antd';
import * as S from './AddCard.styled';
import AddCardIcon from '../../../../resources/img/add_card.svg'

const AddCard = () => {
  const { t } = useTranslation();

  return (
    <S.Wrapper justify="center" align="middle">
      <Space size="small" align="center">
        <Image preview={false} src={AddCardIcon} />
        <S.CardTitle level={4}>{t('lesson_dashboard.add_button')}</S.CardTitle>
      </Space>
    </S.Wrapper>
  );
};

export default AddCard;