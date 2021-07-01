import styled from 'styled-components';
import { Row, Typography } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';

const { Title } = Typography;

export const Wrapper = styled(Row)`
  height: 100%;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.043);
  background: rgba(255, 255, 255, 1);
  cursor: pointer;

  &:hover {
    opacity: 70%;
  }
`;

export const CardTitle = styled(Title)`
  font-size: 1.25rem !important;
  font-weight: 400 !important;
  margin-bottom: 0 !important;
`;

export const Icon = styled(PlusCircleTwoTone)`
  svg {
    height: 52px;
    width: 52px;

    path:nth-child(2) {
      fill: none;
    }
  }
  margin-right: 1rem;
`;
