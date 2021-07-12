import { Col } from 'antd';
import PropTypes from 'prop-types';

import * as S from './GroupBlock.styled';

const GroupBlock = ({ elements, padding, top }) => {
  if (!elements || elements.length === 0) {
    return null;
  }

  if (elements[0]?.props?.element?.type === 'quiz') {
    return elements[0];
  }

  return (
    <S.PageRow justify="center" align="top">
      <S.BlockCol
        top={top}
        xs={{ span: 20 }}
        sm={{ span: 18 }}
        md={{ span: 16 }}
        lg={{ span: 14 }}
      >
        <S.BlockWrapper padding={padding} justify="start" align="top">
          <S.StyledRow justify="space-between">
            {elements.map((elem, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Col key={index} span={24}>
                {elem}
              </Col>
            ))}
          </S.StyledRow>
        </S.BlockWrapper>
      </S.BlockCol>
    </S.PageRow>
  );
};

GroupBlock.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.element),
  padding: PropTypes.string,
  top: PropTypes.string,
};

export default GroupBlock;
