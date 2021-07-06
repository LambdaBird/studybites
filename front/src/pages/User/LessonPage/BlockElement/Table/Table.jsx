import { BlockElementProps } from '../utils';
import * as S from './Table.styled';

const Table = ({ content }) => {
  const contentTable = content.data.content;
  return (
    <S.CustomTableWrapper>
      <S.CustomTable>
        <thead />
        <tbody>
          {contentTable.map((row, rowIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={rowIndex}>
              {row.map((col, colIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <td key={`${rowIndex}-${colIndex}`}>{col}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </S.CustomTable>
    </S.CustomTableWrapper>
  );
};

Table.propTypes = BlockElementProps;

export default Table;
