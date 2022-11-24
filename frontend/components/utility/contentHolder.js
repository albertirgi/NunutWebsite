import React from 'react';
import { ContentHolderWrapper } from './contentHolder.style';

const ContentHolder = props => <ContentHolderWrapper className="isoExampleWrapper" style={props.style}>
  {props.children}
</ContentHolderWrapper>;

export default ContentHolder;
