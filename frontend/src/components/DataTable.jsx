import { useMemo, useState } from 'react';
import { Input, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export default function DataTable({ columns, dataSource, loading = false, searchPlaceholder = 'Поиск...', pageSize = 7 }) {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return dataSource;

    return dataSource.filter((row) => Object.values(row).some((value) =>
      String(value).toLowerCase().includes(query)
    ));
  }, [dataSource, search]);

  return (
    <>
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder={searchPlaceholder}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        style={{ width: 240, maxWidth: '100%', marginBottom: 12 }}
      />
      <Table
        rowKey="key"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize, size: 'small', showSizeChanger: false, showTotal: (total) => `Всего: ${total}` }}
        tableLayout="fixed"
      />
    </>
  );
}
