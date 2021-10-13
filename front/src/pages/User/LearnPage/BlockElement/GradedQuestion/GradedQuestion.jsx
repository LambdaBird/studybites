import { useTranslation } from 'react-i18next';
import { FileOutlined } from '@ant-design/icons';

import File from '@sb-ui/pages/User/LearnPage/BlockElement/GradedQuestion/File';
import { useGradedQuestion } from '@sb-ui/pages/User/LearnPage/BlockElement/GradedQuestion/useGradedQuestion';
import {
  BlockContentType,
  BlockIdType,
  QuizBlockReplyType,
  RevisionType,
  SolvedType,
} from '@sb-ui/pages/User/LearnPage/BlockElement/types';
import { ChunkWrapper } from '@sb-ui/pages/User/LearnPage/LearnPage.styled';

import * as S from './GradedQuestion.styled';

const GradedQuestion = ({ blockId, revision, content, reply, isSolved }) => {
  const { t } = useTranslation('user');
  const { question, requireAttachment } = content?.data;
  const {
    value,
    files,
    handleSendButton,
    onRemoveFile,
    onFileChange,
    uploadHeaders,
    input,
    setInput,
    allowSend,
    fileList,
  } = useGradedQuestion({
    blockId,
    revision,
    reply,
    requireAttachment,
  });

  return (
    <>
      <ChunkWrapper>
        <S.Question>{question}</S.Question>
      </ChunkWrapper>

      {isSolved ? (
        <ChunkWrapper>
          {value && <p>{value}</p>}
          <S.UploadedFileWrapper>
            {files.map(({ location, name }) => (
              <a key={name} href={location}>
                <FileOutlined />
                <S.UploadedFileName>{name}</S.UploadedFileName>
              </a>
            ))}
          </S.UploadedFileWrapper>
        </ChunkWrapper>
      ) : (
        <>
          <S.FileWrapper>
            {fileList.map((file) => (
              <File key={file.uid} {...file} onRemoveFile={onRemoveFile} />
            ))}
          </S.FileWrapper>
          <S.BlockWrapperWhite>
            <S.Upload
              $allowSend={allowSend}
              fileList={fileList}
              onChange={onFileChange}
              headers={uploadHeaders}
            >
              <S.AttachFile $allowSend={allowSend} />
            </S.Upload>
            <S.Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('lesson.input_answer')}
            />
            <S.SendButton $allowSend={allowSend} onClick={handleSendButton}>
              <S.RightOutlined />
            </S.SendButton>
          </S.BlockWrapperWhite>
        </>
      )}
    </>
  );
};

GradedQuestion.propTypes = {
  blockId: BlockIdType,
  revision: RevisionType,
  content: BlockContentType,
  reply: QuizBlockReplyType,
  isSolved: SolvedType,
};

export default GradedQuestion;
