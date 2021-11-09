import { useMemo } from 'react';

import useMobile from '@sb-ui/hooks/useMobile';
import { htmlToReact } from '@sb-ui/pages/User/LearnPage/utils';

import { TableContentType } from '../types';

import * as S from './Table.styled';

const getRowsHeaders = (contentTable) => {
  let headers = contentTable?.[0];
  let rows = contentTable?.slice(1);
  if (rows?.length === 0 && headers?.length !== 0) {
    rows = contentTable;
    headers = [];
  }
  return [rows, headers];
};

const Table = ({ content }) => {
  const contentTable = content.data.content;

  const [rows, headers] = useMemo(
    () => getRowsHeaders(contentTable),
    [contentTable],
  );

  const isMobile = useMobile();

  if (isMobile) {
    return (
      <>
        {rows.map((row) => (
          <S.CustomTableWrapper>
            <S.CustomMobileTable>
              {headers.length === 0 &&
                row.map((_, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <S.Block key={index}>{htmlToReact(row[index])}</S.Block>
                ))}
              {headers.map((header, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <S.Block key={index}>
                  <S.BlockHeader>{htmlToReact(header)}</S.BlockHeader>
                  <S.BlockData>{htmlToReact(row[index])}</S.BlockData>
                </S.Block>
              ))}
            </S.CustomMobileTable>
          </S.CustomTableWrapper>
        ))}
      </>
    );
  }

  return (
    <S.CustomTableWrapper>
      <S.CustomTable>
        <thead>
          {headers.map((header) => (
            <th>{htmlToReact(header)}</th>
          ))}
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={rowIndex}>
              {row?.map((col, colIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <td key={`${rowIndex}-${colIndex}`}>{htmlToReact(col)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </S.CustomTable>
    </S.CustomTableWrapper>
  );
};

Table.propTypes = {
  content: TableContentType,
};

export default Table;
