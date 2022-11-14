import React from 'react';

const HelperText = ({ text = '' }) => <div
  className="isoHelperText"
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '20px',
  }}
>
  <h3>{text}</h3>
</div>;

export default HelperText;
