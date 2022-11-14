import React from 'react';

const Address = ({ companyName, companyAddress }) => <div>
  <p className="NameEmail">
    <span className="Name">{companyName}</span>
    <span className="Email" style={{ whiteSpace: 'pre-line' }}>
      {companyAddress}
    </span>
  </p>
</div>;

export default Address;
