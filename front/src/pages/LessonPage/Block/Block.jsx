import PropTypes from 'prop-types';
import { Col } from 'antd';
import * as S from './Block.styled';

const Block = ({ children }) => (
  <S.PageRow justify="center" align="top">
    <S.BlockCol
      xs={{ span: 20 }}
      sm={{ span: 18 }}
      md={{ span: 16 }}
      lg={{ span: 14 }}
    >
      <S.BlockWrapper justify="start" align="top">
        <S.StyledRow justify="space-between">
          {Array.isArray(children) ? (
            children?.map((elem) => <Col span={24}>{elem}</Col>)
          ) : (
            <Col span={24}>{children}</Col>
          )}
        </S.StyledRow>
      </S.BlockWrapper>
    </S.BlockCol>
  </S.PageRow>
);

Block.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Block;
