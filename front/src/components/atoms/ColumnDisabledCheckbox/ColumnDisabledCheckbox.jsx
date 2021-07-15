import { Col, Row } from 'antd';

import { ColumnDisabledCheckboxPropTypes } from './types';
import * as S from './ColumnDisabledCheckbox.styled';

const ColumnDisabledCheckbox = ({ value, options }) => (
  <Row>
    {options.map((opt, i) => (
      <Col key={opt.value} span={24}>
        <S.DisabledCheckbox disabled checked={value.includes(i)}>
          {opt.label}
        </S.DisabledCheckbox>
      </Col>
    ))}
  </Row>
);

ColumnDisabledCheckbox.propTypes = ColumnDisabledCheckboxPropTypes;

export default ColumnDisabledCheckbox;
