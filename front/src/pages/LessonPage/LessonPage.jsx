import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Progress } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { LESSON_BASE_QUERY } from '@sb-ui/utils/queries';
import {
  generateBlockByElement,
  groupBlocks,
} from '@sb-ui/pages/LessonPage/utils';
import Block from '@sb-ui/pages/LessonPage/Block';
import { getLessonById, postLessonById } from '@sb-ui/utils/api/v1/lesson';
import { USER_HOME } from '@sb-ui/utils/paths';
import InfoBlock from './InfoBlock';
import * as S from './LessonPage.styled';

const LessonPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const { id: lessonId } = useParams();
  const [blocks, setBlocks] = useState([]);
  const [interactiveBlock, setInteractiveBlock] = useState();
  const [isFinal, setIsFinal] = useState(false);
  const [total, setTotal] = useState(0);
  const [nextCount, setNextCount] = useState(0);

  const { data: responseData, isLoading } = useQuery(
    [
      LESSON_BASE_QUERY,
      {
        id: lessonId,
      },
    ],
    getLessonById,
  );

  const { mutate } = useMutation(postLessonById, {
    onSuccess: (newBlocks) => {
      const {
        isFinal: finishStatus,
        lesson,
        total: totalBlocks,
      } = newBlocks?.data;
      if (finishStatus) {
        setIsFinal(finishStatus);
      }

      const dataBlocks = lesson?.blocks;
      if (dataBlocks) {
        if (lesson?.blocks?.length === totalBlocks) {
          setNextCount(dataBlocks.filter((x) => x.type === 'next').length);
          setBlocks([...groupBlocks(dataBlocks)]);
          setInteractiveBlock(null);
        } else {
          setNextCount(
            (prev) => prev + dataBlocks.filter((x) => x.type === 'next').length,
          );
          setBlocks((prev) => [...prev, ...groupBlocks(dataBlocks)]);
          const lastBlock = dataBlocks[dataBlocks.length - 1];
          if (lastBlock) {
            setInteractiveBlock(lastBlock);
          }
        }
      }
    },
  });

  useEffect(() => {
    const dataBlocks = responseData?.lesson?.blocks;
    const finishStatus = responseData?.isFinal;
    if (finishStatus) {
      setIsFinal(finishStatus);
    }
    const totalData = responseData?.total;
    setTotal(totalData);

    if (dataBlocks) {
      setBlocks(groupBlocks(dataBlocks));
      setNextCount(dataBlocks.filter((x) => x.type === 'next').length);
      if (totalData === dataBlocks.length) {
        setInteractiveBlock(null);
      } else {
        const lastBlock = dataBlocks[dataBlocks.length - 1];
        if (lastBlock) {
          setInteractiveBlock(lastBlock);
        }
      }
    }
  }, [responseData]);

  const { lesson } = responseData || {};

  const handleStartClick = () => {
    mutate({ id: lessonId, action: 'start' });
  };

  const handleNextClick = () => {
    const { revision, blockId } = interactiveBlock;
    mutate({ id: lessonId, action: 'next', revision, blockId });
  };

  const handleFinishClick = () => {
    mutate({ id: lessonId, action: 'finish' });
    history.push(USER_HOME);
  };

  useEffect(() => {}, [blocks]);

  return (
    <S.Page>
      <S.Background />
      <S.ProgressCol span={24}>
        <Progress
          showInfo={false}
          percent={(blocks?.flat()?.length / (total - nextCount)) * 100}
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
          <InfoBlock
            isLoading={isLoading}
            total={total - nextCount}
            lesson={lesson}
          />
        </S.BlockCol>
      </S.PageRow>

      {blocks?.map((block) => (
        <Block key={block.map((x) => x.blockId).join('')}>
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
            {!interactiveBlock && blocks?.length === 0 && (
              <S.LessonButton onClick={handleStartClick}>
                {t('lesson.start')}
              </S.LessonButton>
            )}
            {interactiveBlock && !isFinal && (
              <S.LessonButton onClick={handleNextClick}>
                {t('lesson.next')}
              </S.LessonButton>
            )}

            {isFinal && (
              <S.LessonButton onClick={handleFinishClick}>
                {t('lesson.finish')}
              </S.LessonButton>
            )}
          </S.BlockCol>
        </S.PageRowStart>
      )}
    </S.Page>
  );
};

export default LessonPage;
