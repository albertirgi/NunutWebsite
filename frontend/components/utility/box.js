import React from 'react';
import BoxTitleWrapper from './boxTitle';
import { BoxWrapper } from './box.style';

const Box = props => <BoxWrapper
  className={`${props.className ? props.className : ''} isoBoxWrapper`}
  style={props.style}
>
  <BoxTitleWrapper title={props.title} subtitle={props.subtitle} />
  {props.children}
</BoxWrapper>;

export default Box;
