import T from 'prop-types';
import { useMemo } from 'react';

import { CloseOutlined, LoadingOutlined } from '@sb-ui/components/Icons';

import * as S from './File.styled';

const File = ({ uid, name, status, percent, onRemoveFile }) => {
  const iconToRender = useMemo(() => {
    switch (status) {
      case 'success':
      case 'error':
      case 'done':
        return <CloseOutlined onClick={() => onRemoveFile(uid)} />;
      case 'uploading':
        return <LoadingOutlined />;
      default:
        return null;
    }
  }, [onRemoveFile, status, uid]);

  const isError = useMemo(() => status === 'error', [status]);

  return (
    <S.File isError={isError}>
      <S.FileNameWrapper>
        <S.FileName>{name}</S.FileName>
        <S.Icon>{iconToRender}</S.Icon>
      </S.FileNameWrapper>
      {!isError && <S.Progress percent={percent} />}
    </S.File>
  );
};

File.propTypes = {
  uid: T.string,
  name: T.string,
  status: T.string,
  percent: T.number,
  onRemoveFile: T.func,
};

export default File;
