import React, { useMemo } from 'react';
import {
  Button,
  Col,
  Input,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { FullSelect, MainDiv, TableHeader } from './AdminHome.styled';

const { Option } = Select;
const { Search } = Input;
const { Title } = Typography;

const data = [
  {
    key: '1',
    fullName: 'Alex Froloff',
    email: 'alex.fr@gmail.com',
    role: 'teacher',
  },
  {
    key: '2',
    fullName: 'Stephan Roberta',
    email: 'sp@roberta.org',
    role: 'student',
  },
];

const AdminHome = () => {
  const { t } = useTranslation();
  const columns = useMemo(
    () => [
      {
        title: t('admin_home.table.full_name'),
        dataIndex: 'fullName',
        key: 'fullName',
        width: '35%',
      },
      {
        title: t('admin_home.table.email'),
        dataIndex: 'email',
        key: 'email',
        width: '35%',
      },
      {
        title: t('admin_home.table.role'),
        dataIndex: 'role',
        key: 'role',
        render: (role) => (
          <FullSelect defaultValue={role}>
            <Option value="teacher">
              {t('admin_home.table.select_teacher')}
            </Option>
            <Option value="student">
              {t('admin_home.table.select_student')}
            </Option>
          </FullSelect>
        ),
        width: '20%',
      },
      {
        title: 'Action',
        key: 'action',
        render: () => (
          <Space size="middle">
            <Typography.Link>{t('admin_home.table.edit')}</Typography.Link>
          </Space>
        ),
        width: '10%',
      },
    ],
    [t],
  );

  return (
    <MainDiv>
      <TableHeader justify="space-between" align="middle">
        <Col>
          <Row>
            <Space size="large">
              <Title level={2}>{t('admin_home.title')}</Title>
              <Search
                placeholder={t('admin_home.search.placeholder')}
                allowClear
              />
            </Space>
          </Row>
        </Col>
        <Col>
          <Button disabled>{t('admin_home.buttons.add_user')}</Button>
        </Col>
      </TableHeader>
      <Table columns={columns} dataSource={data} pagination={false} />
    </MainDiv>
  );
};

export default AdminHome;
