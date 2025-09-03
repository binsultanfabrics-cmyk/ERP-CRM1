import { UploadOutlined } from '@ant-design/icons';
import { Upload, Form, Button, App } from 'antd';
import useLanguage from '@/locale/useLanguage';

// import photo from '@/style/images/photo.png';

export default function UploadImg() {
  const translate = useLanguage();
  const { message } = App.useApp(); // Use App context for message API
  
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  return (
    <Form.Item
      name="file"
      label={translate('Upload Image')}
      valuePropName="fileList"
      getValueFromEvent={(e) => e.fileList}
    >
      <Upload beforeUpload={beforeUpload}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </Form.Item>
  );
}
