import React, { useMemo, useCallback } from 'react';
import { Dropdown, Table } from 'antd';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';

import { EllipsisOutlined, EyeOutlined, EditOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import useLanguage from '@/locale/useLanguage';
import { useNavigate } from 'react-router-dom';
import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';

export default React.memo(function RecentTable({ ...props }) {
  const translate = useLanguage();
  let { entity, dataTableColumns } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Memoize the action handlers to prevent unnecessary re-renders
  const handleRead = useCallback((record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/${entity}/read/${record._id}`);
  }, [dispatch, navigate, entity]);

  const handleEdit = useCallback((record) => {
    dispatch(erp.currentAction({ actionType: 'update', data: record }));
    navigate(`/${entity}/update/${record._id}`);
  }, [dispatch, navigate, entity]);

  const handleDownload = useCallback((record) => {
    window.open(`${DOWNLOAD_BASE_URL}${entity}/${entity}-${record._id}.pdf`, '_blank');
  }, [entity]);

  // Memoize the dropdown items to prevent recreation on every render
  const items = useMemo(() => [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Edit'),
      key: 'edit',
      icon: <EditOutlined />,
    },
    {
      label: translate('Download'),
      key: 'download',
      icon: <FilePdfOutlined />,
    },
  ], [translate]);

  // Memoize the complete columns array to prevent infinite re-renders
  const memoizedColumns = useMemo(() => {
    return [
      ...dataTableColumns,
      {
        title: '',
        key: 'action',
        render: (_, record) => (
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => {
                switch (key) {
                  case 'read':
                    handleRead(record);
                    break;
                  case 'edit':
                    handleEdit(record);
                    break;
                  case 'download':
                    handleDownload(record);
                    break;
                  default:
                    break;
                }
              },
            }}
            trigger={['click']}
          >
            <EllipsisOutlined
              style={{ cursor: 'pointer', fontSize: '24px' }}
              onClick={(e) => e.preventDefault()}
            />
          </Dropdown>
        ),
      },
    ];
  }, [dataTableColumns, items, handleRead, handleEdit, handleDownload]);

  // Create a stable function reference using useCallback for better stability
  const asyncList = useCallback(() => {
    return request.list({ entity });
  }, [entity]);

  const { result, isLoading, isSuccess } = useFetch(asyncList);
  
  // Memoize the first five items to prevent unnecessary recalculations
  const firstFiveItems = useMemo(() => {
    if (isSuccess && result) return result.slice(0, 5);
    return [];
  }, [isSuccess, result]);

  return (
    <Table
      columns={memoizedColumns}
      rowKey={(item) => item._id}
      dataSource={firstFiveItems}
      pagination={false}
      loading={isLoading}
      scroll={{ x: true }}
    />
  );
});
