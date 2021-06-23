import { Col, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import DebouncedSearch from '@sb-ui/components/atoms/DebouncedSearch/DebouncedSearch';
import { USER_ENROLLED_LESSONS_BASE_KEY } from '@sb-ui/utils/queries';
import { getEnrolledLessons } from '@sb-ui/utils/api/v1/lesson';
import { LessonsHeader, OpenLessonsTitle } from './OngoingLessonsFull.styled';
import LessonsList from '../OngoingLessons/LessonsList';
import { PAGE_SIZE } from '../PublicLessons/constants';

const OngoingLessonsFull = () => {
  const { t } = useTranslation();

  const { isLoading, data: responseData } = useQuery(
    [
      USER_ENROLLED_LESSONS_BASE_KEY,
      {
        limit: PAGE_SIZE,
      },
    ],
    getEnrolledLessons,
    { keepPreviousData: true },
  );
  const { data: lessons } = responseData || {};

  // FIXME: search
  // const [searchText, setSearchText] = useState(null);

  // const onSearchChange = (data) => {
  //   setSearchText(data);
  // };

  return (
    <>
      <LessonsHeader justify="space-between" align="middle">
        <Col>
          <Row justify="center" align="middle">
            <Space size="large">
              <OpenLessonsTitle level={3}>
                {t('user_lessons.ongoing_lessons.title')}
              </OpenLessonsTitle>
              <DebouncedSearch
                delay={500}
                placeholder={t('user_home.open_lessons.search')}
                allowClear
                // onSearch={onSearchChange}
                // onChange={onSearchChange}
              />
            </Space>
          </Row>
        </Col>
      </LessonsHeader>
      <LessonsList lessons={lessons} isLoading={isLoading} />
    </>
  );
};

export default OngoingLessonsFull;
