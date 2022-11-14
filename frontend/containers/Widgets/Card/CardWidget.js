import React from 'react';
import CardWidgetWrapper from './CardWidget.styles';

export default function CardWidget({ icon, number, text }) {
  return (
    <CardWidgetWrapper className="isoCardWidget">
      <div className="isoIconWrapper">{icon}</div>

      <div className="isoContentWrapper">
        <h3 className="isoStatNumber">{number}</h3>
        <span className="isoLabel">{text}</span>
      </div>
    </CardWidgetWrapper>
  );
}
