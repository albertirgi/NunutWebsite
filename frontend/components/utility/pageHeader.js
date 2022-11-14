import React from 'react';
import { ComponentTitleWrapper } from './pageHeader.style';

const PageHeader = props => <ComponentTitleWrapper className="isoComponentTitle">
  {props.children}
</ComponentTitleWrapper>;

export default PageHeader;
