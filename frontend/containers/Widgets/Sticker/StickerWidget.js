import React from 'react';
import { StickerWidgetWrapper } from './StickerWidget.styles';

export default function StickerWidget({ fontColor, bgColor, width, icon, number, text }) {
  const textColor = {
    color: fontColor,
  };
  const widgetStyle = {
    backgroundColor: bgColor,
    width: width,
  };

  return (
    <StickerWidgetWrapper className="isoStickerWidget" style={widgetStyle}>
      <div className="isoIconWrapper">{icon}</div>

      <div className="isoContentWrapper">
        <h3 className="isoStatNumber" style={textColor}>
          {number}
        </h3>
        <span className="isoLabel" style={textColor}>
          {text}
        </span>
      </div>
    </StickerWidgetWrapper>
  );
}
