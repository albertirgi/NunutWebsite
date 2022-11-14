import React from 'react';
import { WidgetWrapper } from './Widgets.styles';

export default function WidgetsWrapper({ children, ...props }) {
  return (
    <WidgetWrapper className="isoWidgetsWrapper" {...props}>
      {children}
    </WidgetWrapper>
  );
}
