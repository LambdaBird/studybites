import { Progress as ProgressAntd } from 'antd';
import styled from 'styled-components';

export const File = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${(props) => (props.isError ? '#ffccc7' : '#e6f7ff')};
  height: 54px;
`;

export const FileNameWrapper = styled.div`
  display: flex;
  padding: 1rem 1rem 0;
  flex-direction: row;
  justify-content: space-between;
`;

export const FileName = styled.div`
  color: black;
`;

export const Icon = styled.div`
  color: rgba(0, 0, 0, 0.45);
`;

export const Progress = styled(ProgressAntd).attrs({
  strokeWidth: 1,
  showInfo: false,
})`
  transform: translateY(3px);
`;
