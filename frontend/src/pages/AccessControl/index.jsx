import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Typography, 
  Row, 
  Col, 
  Modal, 
  Form, 
  Input, 
  Select, 
  App, 
  Popconfirm, 
  Drawer, 
  Descriptions, 
  Divider, 
  Alert, 
  Checkbox,
  message,
  Tabs,
  Badge,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  EyeOutlined,
  UserOutlined,
  SafetyOutlined,
  AuditOutlined,
  LockOutlined,
  UnlockOutlined,
  HistoryOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectEntityList } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function AccessControl() {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { message: messageApi } = App.useApp();
  
  const { result: roles, isLoading: rolesLoading } = useSelector(selectEntityList('role'));
  const { result: permissions, isLoading: permissionsLoading } = useSelector(selectEntityList('permission'));
  const { result: admins, isLoading: adminsLoading } = useSelector(selectEntityList('admin'));
  const { result: auditLogs, isLoading: auditLogsLoading } = useSelector(selectEntityList('auditlog'));

  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [isAuditDrawerVisible, setIsAuditDrawerVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [editingPermission, setEditingPermission] = useState(null);
  const [viewingAuditLog, setViewingAuditLog] = useState(null);
  const [roleForm] = Form.useForm();
  const [permissionForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('roles');

  const rolesList = roles?.items || [];
  const permissionsList = permissions?.items || [];
  const adminsList = admins?.items || [];
  const auditLogsList = auditLogs?.items || [];

  useEffect(() => {
    dispatch(crud.list({ entity: 'role' }));
    dispatch(crud.list({ entity: 'permission' }));
    dispatch(crud.list({ entity: 'admin' }));
    dispatch(crud.list({ entity: 'auditlog' }));
  }, []);

  // Group permissions by module
  const groupedPermissions = permissionsList.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {});

  const handleCreateRole = () => {
    setEditingRole(null);
    roleForm.resetFields();
    setIsRoleModalVisible(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    roleForm.setFieldsValue({
      ...role,
      permissions: role.permissions || [],
    });
    setIsRoleModalVisible(true);
  };

  const handleSubmitRole = async (values) => {
    try {
      setLoading(true);
      
      const roleData = {
        name: values.name,
        description: values.description,
        permissions: values.permissions,
      };

      if (editingRole) {
        await dispatch(crud.update({ 
          entity: 'role', 
          id: editingRole._id, 
          jsonData: roleData 
        }));
        messageApi.success('Role updated successfully');
      } else {
        await dispatch(crud.create({ 
          entity: 'role', 
          jsonData: roleData 
        }));
        messageApi.success('Role created successfully');
      }

      setIsRoleModalVisible(false);
      roleForm.resetFields();
      dispatch(crud.list({ entity: 'role' }));
    } catch (error) {
      messageApi.error('Failed to save role');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      setLoading(true);
      await dispatch(crud.delete({ entity: 'role', id: roleId }));
      messageApi.success('Role deleted successfully');
      dispatch(crud.list({ entity: 'role' }));
    } catch (error) {
      messageApi.error('Failed to delete role');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAuditLog = (log) => {
    setViewingAuditLog(log);
    setIsAuditDrawerVisible(true);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'LOW': 'green',
      'MEDIUM': 'blue',
      'HIGH': 'orange',
      'CRITICAL': 'red',
    };
    return colors[severity] || 'default';
  };

  const getActionColor = (action) => {
    const colors = {
      'CREATE': 'green',
      'UPDATE': 'blue',
      'DELETE': 'red',
      'APPROVE': 'green',
      'REJECT': 'red',
      'LOGIN': 'blue',
      'LOGOUT': 'default',
      'UNAUTHORIZED_ACCESS': 'red',
    };
    return colors[action] || 'default';
  };

  // Roles Table
  const roleColumns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          {record.isSystemRole && (
            <Tag color="blue" style={{ marginLeft: 8 }}>System</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <div>
          <Text>{permissions?.length || 0} permissions</Text>
          <br />
          <Space wrap>
            {permissions?.slice(0, 3).map(permission => (
              <Tag key={permission} size="small">{permission}</Tag>
            ))}
            {permissions?.length > 3 && (
              <Tag size="small">+{permissions.length - 3} more</Tag>
            )}
          </Space>
        </div>
      ),
    },
    {
      title: 'Users',
      key: 'users',
      render: (_, record) => {
        const usersWithRole = adminsList.filter(admin => admin.role === record._id);
        return (
          <Badge count={usersWithRole.length} showZero>
            <UserOutlined />
          </Badge>
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => handleEditRole(record)}
          >
            View
          </Button>
          {!record.isSystemRole && (
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => handleEditRole(record)}
            >
              Edit
            </Button>
          )}
          {!record.isSystemRole && (
            <Popconfirm
              title="Are you sure you want to delete this role?"
              onConfirm={() => handleDeleteRole(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // Audit Logs Table
  const auditColumns = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action) => (
        <Tag color={getActionColor(action)}>{action}</Tag>
      ),
    },
    {
      title: 'Entity',
      dataIndex: 'entity',
      key: 'entity',
    },
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div>
          <Text strong>{record.userEmail}</Text>
          <br />
          <Text style={{ color: 'var(--text-secondary)' }}>{record.userId}</Text>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => (
        <Tag color={getSeverityColor(severity)}>{severity}</Tag>
      ),
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
    },
    {
      title: 'Date',
      dataIndex: 'created',
      key: 'created',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="text" 
          icon={<EyeOutlined />}
          onClick={() => handleViewAuditLog(record)}
        >
          View
        </Button>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'roles',
      label: '👥 Roles',
      children: (
        <div>
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreateRole}
            >
              Create Role
            </Button>
          </div>
          <Table
            dataSource={rolesList}
            columns={roleColumns}
            loading={rolesLoading}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: 'permissions',
      label: '🔐 Permissions',
      children: (
        <div>
          <Alert
            message="System Permissions"
            description="These are the available permissions in the system. Roles can be assigned combinations of these permissions."
            type="info"
            showIcon
            style={{ marginBottom: 20 }}
          />
          
          {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
            <Card key={module} title={`${module} Module`} style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                {modulePermissions.map(permission => (
                  <Col span={8} key={permission._id}>
                    <Card size="small">
                      <div>
                        <Text strong>{permission.name}</Text>
                        <br />
                        <Text style={{ color: 'var(--text-secondary)' }}>{permission.description}</Text>
                        <br />
                        <Tag color="blue">{permission.action}</Tag>
                        <Tag color="green">{permission.resource}</Tag>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          ))}
        </div>
      ),
    },
    {
      key: 'audit',
      label: '📋 Audit Logs',
      children: (
        <div>
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button 
              icon={<ReloadOutlined />}
              onClick={() => dispatch(crud.list({ entity: 'auditlog' }))}
            >
              Refresh
            </Button>
          </div>
          <Table
            dataSource={auditLogsList}
            columns={auditColumns}
            loading={auditLogsLoading}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 20 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: 'var(--brand-primary)' }}>
              🔐 Access Control & Security
            </Title>
            <Text style={{ color: 'var(--text-secondary)' }}>Manage roles, permissions, and audit logs</Text>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<ReloadOutlined />}
                onClick={() => {
                  dispatch(crud.list({ entity: 'role' }));
                  dispatch(crud.list({ entity: 'permission' }));
                  dispatch(crud.list({ entity: 'auditlog' }));
                }}
              >
                Refresh All
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>

      {/* Role Modal */}
      <Modal
        title={editingRole ? 'Edit Role' : 'Create Role'}
        open={isRoleModalVisible}
        onCancel={() => setIsRoleModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={roleForm}
          layout="vertical"
          onFinish={handleSubmitRole}
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please enter role name' }]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={3} placeholder="Enter role description" />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[{ required: true, message: 'Please select at least one permission' }]}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                <div key={module} style={{ marginBottom: 16 }}>
                  <Title level={5}>{module} Module</Title>
                  <Row gutter={[8, 8]}>
                    {modulePermissions.map(permission => (
                      <Col span={12} key={permission._id}>
                        <Checkbox value={permission.name}>
                          <div>
                            <Text strong>{permission.name}</Text>
                            <br />
                            <Text style={{ color: 'var(--text-secondary)' }} style={{ fontSize: '12px' }}>
                              {permission.description}
                            </Text>
                          </div>
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </Checkbox.Group>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Space>
              <Button onClick={() => setIsRoleModalVisible(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
                icon={<PlusOutlined />}
              >
                {editingRole ? 'Update' : 'Create'} Role
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Audit Log Drawer */}
      <Drawer
        title="Audit Log Details"
        placement="right"
        width={600}
        open={isAuditDrawerVisible}
        onClose={() => setIsAuditDrawerVisible(false)}
      >
        {viewingAuditLog && (
          <div>
            <Descriptions title="Basic Information" bordered column={1}>
              <Descriptions.Item label="Action">
                <Tag color={getActionColor(viewingAuditLog.action)}>
                  {viewingAuditLog.action}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Entity">
                {viewingAuditLog.entity}
              </Descriptions.Item>
              <Descriptions.Item label="Entity ID">
                {viewingAuditLog.entityId}
              </Descriptions.Item>
              <Descriptions.Item label="User">
                {viewingAuditLog.userEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Severity">
                <Tag color={getSeverityColor(viewingAuditLog.severity)}>
                  {viewingAuditLog.severity}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="IP Address">
                {viewingAuditLog.ipAddress}
              </Descriptions.Item>
              <Descriptions.Item label="User Agent">
                <Text code style={{ fontSize: '12px' }}>
                  {viewingAuditLog.userAgent}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                {dayjs(viewingAuditLog.created).format('DD/MM/YYYY HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div>
              <Title level={4}>Description</Title>
              <Text>{viewingAuditLog.description}</Text>
            </div>

            {viewingAuditLog.changes && (
              <>
                <Divider />
                <div>
                  <Title level={4}>Changes</Title>
                  {viewingAuditLog.changes.before && (
                    <div style={{ marginBottom: 16 }}>
                      <Text strong>Before:</Text>
                      <pre style={{ 
                        background: 'var(--bg-primary)', color: 'var(--text-primary)', 
                        padding: 8, 
                        borderRadius: 4,
                        fontSize: '12px',
                        marginTop: 4
                      }}>
                        {JSON.stringify(viewingAuditLog.changes.before, null, 2)}
                      </pre>
                    </div>
                  )}
                  {viewingAuditLog.changes.after && (
                    <div>
                      <Text strong>After:</Text>
                      <pre style={{ 
                        background: 'var(--bg-primary)', color: 'var(--text-primary)', 
                        padding: 8, 
                        borderRadius: 4,
                        fontSize: '12px',
                        marginTop: 4
                      }}>
                        {JSON.stringify(viewingAuditLog.changes.after, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </>
            )}

            {viewingAuditLog.metadata && (
              <>
                <Divider />
                <div>
                  <Title level={4}>Metadata</Title>
                  <pre style={{ 
                    background: 'var(--bg-primary)', color: 'var(--text-primary)', 
                    padding: 8, 
                    borderRadius: 4,
                    fontSize: '12px'
                  }}>
                    {JSON.stringify(viewingAuditLog.metadata, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
