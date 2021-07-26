import { Progress } from 'antd';
import PropTypes from 'prop-types';

import InfoBlock from '@sb-ui/pages/User/LessonPage/InfoBlock';

import * as S from './Header.styled';

const Header = ({ isLoading, percent, total, lesson }) => (
  <>
    <S.ProgressCol span={24}>
      <Progress
        showInfo={false}
        percent={percent}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </S.ProgressCol>
    <S.PageRow justify="center" align="top">
      <S.BlockCol
        xs={{ span: 20 }}
        sm={{ span: 18 }}
        md={{ span: 16 }}
        lg={{ span: 14 }}
      >
        <InfoBlock isLoading={isLoading} total={total} lesson={lesson} />
      </S.BlockCol>
    </S.PageRow>
  </>
);

Header.propTypes = {
  total: PropTypes.number,
  percent: PropTypes.number,
  isLoading: PropTypes.bool,
  lesson: PropTypes.shape({
    name: PropTypes.string,
    author:
      PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
  }),
};

export default Header;
