import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Progress } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { LESSON_BASE_QUERY } from '@sb-ui/utils/queries';
import {
  CURRENT_MOCK_BLOCK_TEST,
  getLessons,
  postLessons,
} from '@sb-ui/utils/api/v1/lessons';
import {
  generateBlockByElement,
  groupBlocks,
} from '@sb-ui/pages/LessonPage/utils';
import Block from '@sb-ui/pages/LessonPage/Block';
import InfoBlock from './InfoBlock';
import * as S from './LessonPage.styled';

const LessonPage = () => {
  const { t } = useTranslation();
  const { id: lessonId } = useParams();
  const [lastDataBlocks, setLastDataBlocks] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [interactiveBlock, setInteractiveBlock] = useState();

  const [_blockTest, _setBlockTest] = useState(CURRENT_MOCK_BLOCK_TEST); // TODO REMOVE FOR MOCKED RESPONSE

  const { data: responseData, isLoading } = useQuery(
    [LESSON_BASE_QUERY, lessonId],
    getLessons,
  );

  const { mutate } = useMutation(postLessons, {
    onSuccess: (newBlocks) => {
      const dataBlocks = newBlocks?.data;
      if (dataBlocks) {
        setBlocks((prev) => [...prev, ...groupBlocks(dataBlocks)]);
        setLastDataBlocks(dataBlocks);
        const lastBlock = dataBlocks[dataBlocks.length - 1];
        if (lastBlock) {
          setInteractiveBlock(lastBlock);
        }
      }
    },
  });

  const [percents] = useState(0);

  useEffect(() => {
    const dataBlocks = responseData?.data?.blocks;
    if (dataBlocks) {
      setBlocks(groupBlocks(dataBlocks));
      setLastDataBlocks(dataBlocks);
      const lastBlock = dataBlocks[dataBlocks.length - 1];
      if (lastBlock) {
        setInteractiveBlock(lastBlock);
      }
    }
  }, [responseData]);

  const { data } = responseData || {};

  const handleStartClick = () => {
    mutate(_blockTest);
    _setBlockTest((prev) => prev + 4);
  };

  const handleNextClick = () => {
    mutate(_blockTest);
    _setBlockTest((prev) => prev + 4);
  };

  return (
    <S.Page>
      <S.Background />
      <S.ProgressCol span={24}>
        <Progress
          showInfo={false}
          percent={percents}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </S.ProgressCol>
      <S.PageRow justify="center" align="top">
        <S.BlockCol
          xs={{ span: 20 }}
          sm={{ span: 18 }}
          md={{ span: 16 }}
          lg={{ span: 12 }}
        >
          <InfoBlock isLoading={isLoading} lesson={data} />
        </S.BlockCol>
      </S.PageRow>

      {blocks?.map((block) => (
        <Block key={block.blockId}>
          {block.map((element) => generateBlockByElement(element))}
        </Block>
      ))}
      {!isLoading && (
        <S.PageRowStart justify="center" align="top">
          <S.BlockCol
            xs={{ span: 20 }}
            sm={{ span: 18 }}
            md={{ span: 16 }}
            lg={{ span: 12 }}
          >
            {!interactiveBlock && lastDataBlocks?.length === 0 && (
              <S.LessonButton onClick={handleStartClick}>
                {t('lesson.start')}
              </S.LessonButton>
            )}
            {interactiveBlock && lastDataBlocks?.length !== 0 && (
              <S.LessonButton onClick={handleNextClick}>
                {t('lesson.next')}
              </S.LessonButton>
            )}

            {interactiveBlock && lastDataBlocks?.length === 0 && (
              <S.LessonButton onClick={handleNextClick}>
                It`s end :)
              </S.LessonButton>
            )}
          </S.BlockCol>
        </S.PageRowStart>
      )}
    </S.Page>
  );
};

export default LessonPage;
