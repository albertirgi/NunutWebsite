import React from 'react';
import InputNumber from '@iso/components/uielements/InputNumber';

export default function InputNumberComponent() {
  const onChange = value => {};
  return <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />;
}
