import T from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined } from '@ant-design/icons';

import * as S from './StudentItem.styled';

const StudentItem = ({ id, name, isPending, handleRemoveStudent }) => {
  const { t } = useTranslation('teacher');

  return (
    <S.ListItem>
      <S.Avatar />
      <S.Name type={isPending && 'secondary'}>{name}</S.Name>
      <S.ResendWrapper>
        {isPending && (
          <S.ResendButton>{t('invite_students.resend_button')}</S.ResendButton>
        )}
      </S.ResendWrapper>
      <S.DeleteButton onClick={() => handleRemoveStudent(id)}>
        <DeleteOutlined />
      </S.DeleteButton>
    </S.ListItem>
  );
};

StudentItem.propTypes = {
  id: T.number,
  name: T.string,
  isPending: T.bool,
  handleRemoveStudent: T.func,
};

export default StudentItem;
