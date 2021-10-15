import { useCallback, useContext, useMemo, useState } from 'react';

import LearnContext from '@sb-ui/contexts/LearnContext';
import { RESPONSE_TYPE } from '@sb-ui/pages/User/LearnPage/utils';
import { getJWTAccessToken } from '@sb-ui/utils/jwt';

export const useGradedQuestion = ({
  blockId,
  revision,
  reply,
  requireAttachment,
}) => {
  const { handleInteractiveClick, id } = useContext(LearnContext);
  const [input, setInput] = useState('');
  const [fileList, setFileList] = useState([]);

  const token = getJWTAccessToken();

  const uploadHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token],
  );

  const onFileChange = useCallback(({ fileList: fileListNew }) => {
    setFileList([...fileListNew]);
  }, []);

  const onRemoveFile = useCallback((uid) => {
    setFileList((prev) => prev.filter((x) => x.uid !== uid));
  }, []);

  const notErrorCheck = useCallback((file) => file.status !== 'error', []);

  const allowSend = useMemo(
    () => (requireAttachment ? fileList?.some(notErrorCheck) : true),
    [fileList, notErrorCheck, requireAttachment],
  );

  const { value, files } = reply || {};

  const handleSendButton = useCallback(() => {
    handleInteractiveClick({
      id,
      action: RESPONSE_TYPE,
      blockId,
      revision,
      reply: {
        value: input,
        files: fileList
          .filter((file) => file.status === 'done')
          .map((file) => file.response),
      },
    });
  }, [blockId, fileList, handleInteractiveClick, id, input, revision]);

  const isSendDisabled = useMemo(() => {
    if (fileList?.some(notErrorCheck)) {
      return false;
    }
    return input.trim().length === 0;
  }, [fileList, input, notErrorCheck]);

  return {
    handleSendButton,
    onFileChange,
    onRemoveFile,
    uploadHeaders,
    value,
    files,
    fileList,
    allowSend,
    input,
    setInput,
    isSendDisabled,
  };
};
