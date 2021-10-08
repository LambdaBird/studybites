import styled from 'styled-components';

import variables from '@sb-ui/theme/variables';

export const Block = styled.div`
  padding: 1rem;
  flex-grow: 1;
`;

export const BlockHeader = styled.div`
  color: ${variables['text-table-header']};
  font-size: 0.75rem;
`;

export const BlockData = styled.div`
  margin-top: 1rem;
`;

export const CustomTableWrapper = styled.div`
  margin-top: 1rem;
  background-color: white;
  padding: 1rem;
  border-radius: 1rem;
`;

export const CustomTable = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  td {
    padding: 19px;
  }

  th {
    font-weight: normal;
    color: ${variables['text-table-header']};
    text-align: left;
    font-size: 0.75rem;
    padding: 19px;
  }
`;

export const CustomMobileTable = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
