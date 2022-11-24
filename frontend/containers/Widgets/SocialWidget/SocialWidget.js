import React from 'react';
import { SocialWidgetWrapper } from './SocialWidget.styles';

export default function SocialWidget({ children }) {
  return (
    <SocialWidgetWrapper className="isoSocialWidgetWrapper">
      {children}
    </SocialWidgetWrapper>
  );
}
