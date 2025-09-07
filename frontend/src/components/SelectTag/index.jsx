import { Select } from 'antd';
import { generate as uniqueId } from 'shortid';

export default function SelectTag({ options, defaultValue }) {
  return (
    <Select
      defaultValue={defaultValue}
      style={{
        width: '100%',
      }}
    >
      {options?.map((value) => {
        if (typeof value === 'object' && value.value)
          return (
            <Select.Option key={`${uniqueId()}`} value={value.value}>
              {value.label}
            </Select.Option>
          );
        else
          return (
            <Select.Option key={`${uniqueId()}`} value={value}>
              {value}
            </Select.Option>
          );
      })}
    </Select>
  );
}
