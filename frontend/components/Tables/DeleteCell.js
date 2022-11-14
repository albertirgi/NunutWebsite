import React from 'react';
import Popconfirm from '../Feedback/Popconfirm';

export default function DeleteCell({ index, onDeleteCell }) {
  return (
    <Popconfirm
      title="Sure to delete?"
      okText="DELETE"
      cancelText="No"
      onConfirm={() => onDeleteCell(index)}
    >
      <a href="# ">Delete</a>
    </Popconfirm>
  );
}
