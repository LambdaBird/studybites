import { Button, List as ListAntd, Modal as ModalAntd } from 'antd';
import CreatableSelect from 'react-select/creatable';
import styled from 'styled-components';

export const List = styled(ListAntd)`
  max-height: 500px;
  overflow-y: auto;
`;

export const Modal = styled(ModalAntd)`
  width: 650px;
`;

export const SearchWrapper = styled.div`
  display: flex;
  padding: 0.75rem 1.5rem;
`;

export const Search = styled(CreatableSelect).attrs({
  closeMenuOnSelect: false,
  isMulti: true,
  isClearable: true,
})`
  width: 100%;
`;

export const SearchButton = styled(Button).attrs({
  type: 'primary',
})`
  height: 38px;
`;

export const CopyLinkButton = styled(Button).attrs({
  type: 'link',
})``;
