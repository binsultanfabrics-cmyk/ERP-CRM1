import { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Tag, Typography, Row, Col, Statistic, Modal, Form, Input, Select, Popconfirm, Drawer, Descriptions, Divider, Avatar, DatePicker, App } from 'antd';
import { PlusOutlined, TeamOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined, PhoneOutlined, MailOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectEntityList } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function Employee() {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { message } = App.useApp(); // Use App context for message API
  const { result: employees, pagination, isLoading } = useSelector(selectEntityList('employee'));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewDrawerVisible, setIsViewDrawerVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(crud.list({ entity: 'employee' }));
  }, []);

  // Ensure data exists and has the correct structure
  const employeesList = employees?.items || [];

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      salary: employee.salary,
      hireDate: employee.hireDate ? dayjs(employee.hireDate) : null,
      address: employee.address,
      city: employee.city,
      country: employee.country,
      status: employee.status || 'Active',
      notes: employee.notes
    });
    setIsModalVisible(true);
  };

  const handleViewEmployee = (employee) => {
    setViewingEmployee(employee);
    setIsViewDrawerVisible(true);
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      setLoading(true);
      await dispatch(crud.delete({ entity: 'employee', id: employeeId }));
      message.success('Employee deleted successfully');
      dispatch(crud.list({ entity: 'employee' }));
    } catch (error) {
      message.error('Failed to delete employee');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const employeeData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        position: values.position,
        department: values.department,
        salary: values.salary,
        hireDate: values.hireDate ? values.hireDate.toISOString() : null,
        address: values.address,
        city: values.city,
        country: values.country,
        status: values.status,
        notes: values.notes
      };

      if (editingEmployee) {
        await dispatch(crud.update({ entity: 'employee', id: editingEmployee._id, jsonData: employeeData }));
        message.success('Employee updated successfully');
      } else {
        await dispatch(crud.create({ entity: 'employee', jsonData: employeeData }));
        message.success('Employee created successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      dispatch(crud.list({ entity: 'employee' }));
    } catch (error) {
      message.error('Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    dispatch(crud.list({ entity: 'employee' }));
    message.success('Data refreshed');
  };

  const getEmployeeStats = () => {
    if (!employeesList || !Array.isArray(employeesList)) return { total: 0, active: 0, inactive: 0, new: 0 };
    
    const active = employeesList.filter(e => e.status === 'Active').length;
    const inactive = employeesList.filter(e => e.status === 'Inactive').length;
    const newEmployees = employeesList.filter(e => {
      if (!e.hireDate) return false;
      const hireDate = new Date(e.hireDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return hireDate >= thirtyDaysAgo;
    }).length;

    return {
      total: employeesList.length,
      active,
      inactive,
      new: newEmployees
    };
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{name}</Text>
            <br />
            <Text style={{ color: 'var(--text-secondary)' }}>{record.position}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div><PhoneOutlined /> {record.phone || 'N/A'}</div>
          <div><MailOutlined /> {record.email || 'N/A'}</div>
        </div>
      )
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept) => <Tag color="blue">{dept || 'N/A'}</Tag>
    },
    {
      title: 'Hire Date',
      dataIndex: 'hireDate',
      key: 'hireDate',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'Active' ? 'green' : 'red';
        return <Tag color={color}>{status || 'Active'}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewEmployee(record)}
          >
            View
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditEmployee(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this employee?"
            onConfirm={() => handleDeleteEmployee(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="link" 
              size="small" 
              danger 
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const stats = getEmployeeStats();

  return (
    <div style={{ padding: '24px', background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
                 <Title level={2} style={{ margin: 0, color: 'var(--brand-primary)' }}>
           👥 Bin Sultan Employee Management
         </Title>
         <Text style={{ color: 'var(--text-secondary)' }}>Manage your staff and team members - Pakistan&apos;s Premier Cloth Shop Team</Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Employees"
              value={stats.total}
              valueStyle={{ color: 'var(--brand-primary)' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Staff"
              value={stats.active}
              valueStyle={{ color: '#52c41a' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Inactive Staff"
              value={stats.inactive}
              valueStyle={{ color: '#faad14' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="New Hires (30 days)"
              value={stats.new}
              valueStyle={{ color: '#722ed1' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Employees Table */}
      <Card
        title="Employees"
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
              loading={isLoading}
            >
              Refresh
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddEmployee}
            >
              Add Employee
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={employeesList}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          pagination={{
            current: pagination?.current || 1,
            pageSize: pagination?.pageSize || 10,
            total: pagination?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} employees`,
          }}
        />
      </Card>

      {/* Add/Edit Employee Modal */}
      <Modal
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'Active'
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter employee name' }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="position"
                label="Position"
                rules={[{ required: true, message: 'Please enter position' }]}
              >
                <Input placeholder="Enter job position" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { type: 'email', message: 'Please enter a valid email' },
                  { required: true, message: 'Please enter email' }
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please select department' }]}
              >
                                 <Select placeholder="Select department">
                   <Option value="Sales">Sales (Farokht)</Option>
                   <Option value="Customer Service">Customer Service (Mashgooliat)</Option>
                   <Option value="Inventory">Inventory (Stock)</Option>
                   <Option value="Management">Management (Intizamia)</Option>
                   <Option value="Finance">Finance (Maliyat)</Option>
                   <Option value="IT">IT (Computer)</Option>
                   <Option value="Tailoring">Tailoring (Darzi)</Option>
                   <Option value="Quality Control">Quality Control (Gunah)</Option>
                   <Option value="Other">Other</Option>
                 </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select>
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                  <Option value="On Leave">On Leave</Option>
                  <Option value="Terminated">Terminated</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="hireDate"
                label="Hire Date"
              >
                <DatePicker style={{ width: '100%' }} placeholder="Select hire date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="salary"
                label="Salary"
              >
                                 <Input placeholder="Enter salary amount" prefix="Rs " />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Address"
          >
            <TextArea rows={2} placeholder="Enter street address" />
          </Form.Item>

          <Row gutter={16}>
                         <Col span={12}>
               <Form.Item
                 name="city"
                 label="City"
               >
                 <Select placeholder="Select city" showSearch>
                   <Option value="Karachi">Karachi</Option>
                   <Option value="Lahore">Lahore</Option>
                   <Option value="Islamabad">Islamabad</Option>
                   <Option value="Rawalpindi">Rawalpindi</Option>
                   <Option value="Faisalabad">Faisalabad</Option>
                   <Option value="Multan">Multan</Option>
                   <Option value="Peshawar">Peshawar</Option>
                   <Option value="Quetta">Quetta</Option>
                   <Option value="Sialkot">Sialkot</Option>
                   <Option value="Gujranwala">Gujranwala</Option>
                   <Option value="Other">Other</Option>
                 </Select>
               </Form.Item>
             </Col>
             <Col span={12}>
               <Form.Item
                 name="country"
                 label="Country"
               >
                 <Select placeholder="Select country">
                   <Option value="Pakistan">Pakistan</Option>
                   <Option value="India">India</Option>
                   <Option value="Afghanistan">Afghanistan</Option>
                   <Option value="UAE">UAE</Option>
                   <Option value="Saudi Arabia">Saudi Arabia</Option>
                   <Option value="UK">UK</Option>
                   <Option value="USA">USA</Option>
                   <Option value="Other">Other</Option>
                 </Select>
               </Form.Item>
             </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={3} placeholder="Any additional notes about this employee" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingEmployee ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Employee Drawer */}
      <Drawer
        title="Employee Details"
        placement="right"
        onClose={() => setIsViewDrawerVisible(false)}
        open={isViewDrawerVisible}
        width={500}
      >
        {viewingEmployee && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Avatar size={80} icon={<UserOutlined />} />
              <Title level={3} style={{ marginTop: '10px' }}>{viewingEmployee.name}</Title>
              <Tag color={viewingEmployee.status === 'Active' ? 'green' : 'red'}>
                {viewingEmployee.status || 'Active'}
              </Tag>
              <br />
              <Text style={{ color: 'var(--text-secondary)' }}>{viewingEmployee.position}</Text>
            </div>

            <Descriptions column={1} bordered>
              <Descriptions.Item label="Email">
                {viewingEmployee.email || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {viewingEmployee.phone || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                <Tag color="blue">{viewingEmployee.department || 'N/A'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Position">
                {viewingEmployee.position || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Hire Date">
                <CalendarOutlined /> {viewingEmployee.hireDate ? 
                  new Date(viewingEmployee.hireDate).toLocaleDateString() : 'N/A'
                }
              </Descriptions.Item>
              <Descriptions.Item label="Salary">
                                 Rs {viewingEmployee.salary ? (parseFloat(viewingEmployee.salary)).toFixed(2) : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Address" span={3}>
                {viewingEmployee.address || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="City">
                {viewingEmployee.city || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                {viewingEmployee.country || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Notes" span={3}>
                {viewingEmployee.notes || 'No notes available'}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>Quick Actions</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => {
                  setIsViewDrawerVisible(false);
                  handleEditEmployee(viewingEmployee);
                }}
                style={{ width: '100%' }}
              >
                Edit Employee
              </Button>
              <Button 
                icon={<PhoneOutlined />}
                onClick={() => window.open(`tel:${viewingEmployee.phone}`, '_self')}
                disabled={!viewingEmployee.phone}
                style={{ width: '100%' }}
              >
                Call Employee
              </Button>
              <Button 
                icon={<MailOutlined />}
                onClick={() => window.open(`mailto:${viewingEmployee.email}`, '_self')}
                disabled={!viewingEmployee.email}
                style={{ width: '100%' }}
              >
                Send Email
              </Button>
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
}
