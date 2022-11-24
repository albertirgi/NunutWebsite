import React from 'react';
import { LayoutContentWrapper } from './layoutWrapper.style';

const LayoutWrapper = props => <LayoutContentWrapper
  className={
    props.className != null
      ? `${props.className} isoLayoutContentWrapper`
      : 'isoLayoutContentWrapper'
  }
  {...props}
>
  {props.children}
</LayoutContentWrapper>;

export default LayoutWrapper;
