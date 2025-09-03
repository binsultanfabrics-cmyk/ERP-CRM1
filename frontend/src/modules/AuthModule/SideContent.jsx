import { Space, Layout, Divider, Typography } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { useSelector } from 'react-redux';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();

  return (
    <Content
      style={{
        padding: '150px 30px 30px',
        width: '100%',
        maxWidth: '450px',
        margin: '0 auto',
      }}
      className="sideContent"
    >
      <div style={{ width: '100%' }}>
        <div style={{ 
          margin: '0 0 40px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '16px'
        }}>
          <ShopOutlined style={{ fontSize: '48px', color: '#FFFFFF' }} />
          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#FFFFFF',
              lineHeight: '1.2'
            }}>
              Bin Sultan ERP + POS
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.8)',
              marginTop: '4px'
            }}>
              Professional Cloth Shop Management
            </div>
          </div>
        </div>

        <Title level={1} style={{ fontSize: 28, color: '#FFFFFF' }}>
          Professional ERP + POS System
        </Title>
        <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          Complete business management solution for clothing and fabric stores
        </Text>

        <div className="space20"></div>
      </div>
    </Content>
  );
}
