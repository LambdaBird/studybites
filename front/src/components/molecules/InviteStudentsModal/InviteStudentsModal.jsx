import T from 'prop-types';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import StudentItem from './StudentItem';
import { useSearch } from './useSearch';
import * as S from './InviteStudentsModal.styled';

const InviteStudentsModal = ({ show = false, setShow = () => {} }) => {
  const { t } = useTranslation('teacher');

  const [students, setStudents] = useState([]);

  const handleRemoveStudent = useCallback((id) => {
    setStudents((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const {
    searchOptions,
    searchValues,
    handleSearchChange,
    handleInviteStudents,
  } = useSearch({
    students,
    setStudents,
  });

  const handleCancel = useCallback(() => {
    setShow(false);
  }, [setShow]);

  return (
    <div>
      <S.Modal
        onCancel={handleCancel}
        visible={show}
        title={t('invite_students.title')}
        footer={
          <S.CopyLinkButton>{t('invite_students.copy_link')}</S.CopyLinkButton>
        }
      >
        <S.SearchWrapper>
          <S.Search
            options={searchOptions}
            value={searchValues}
            onChange={handleSearchChange}
            placeholder={t('invite_students.input_placeholder')}
          />
          <S.SearchButton onClick={handleInviteStudents}>Add</S.SearchButton>
        </S.SearchWrapper>
        <S.List>
          {students.map(({ id, ...student }) => (
            <StudentItem
              key={id}
              id={id}
              {...student}
              handleRemoveStudent={handleRemoveStudent}
            />
          ))}
        </S.List>
      </S.Modal>
    </div>
  );
};

InviteStudentsModal.propTypes = {
  show: T.bool,
  setShow: T.func,
};

export default InviteStudentsModal;
