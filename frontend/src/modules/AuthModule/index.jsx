import useLanguage from '@/locale/useLanguage';

import { Layout, Col, Divider, Typography } from 'antd';
import { ShopOutlined } from '@ant-design/icons';

import AuthLayout from '@/layout/AuthLayout';
import SideContent from './SideContent';

const { Content } = Layout;
const { Title } = Typography;

const AuthModule = ({ authContent, AUTH_TITLE, isForRegistre = false }) => {
  const translate = useLanguage();
  return (
    <AuthLayout sideContent={<SideContent />}>
      <Content
        style={{
          padding: isForRegistre ? '40px 30px 30px' : '100px 30px 30px',
          maxWidth: '440px',
          margin: '0 auto',
        }}
      >
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 0 }} span={0}>
          <div style={{
            margin: '0px auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <ShopOutlined style={{ fontSize: '32px', color: '#1E40AF' }} />
            <span style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#1E40AF' 
            }}>
              Bin Sultan ERP + POS
            </span>
          </div>
          <div className="space10" />
        </Col>
        <Title level={1}>{translate(AUTH_TITLE)}</Title>

        <Divider />
        <div className="site-layout-content">{authContent}</div>
      </Content>
    </AuthLayout>
  );
};

export default AuthModule;
