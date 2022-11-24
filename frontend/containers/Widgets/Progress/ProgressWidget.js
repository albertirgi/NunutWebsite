import React from 'react';
import Progress from '@iso/components/uielements/progress';
import { ProgressWidgetWrapper } from './ProgressWidget.styles';

export default function ProgressWidget({
  label,
  icon,
  details,
  percent,
  barHeight,
  status,
}) {
  return (
    <ProgressWidgetWrapper className="isoProgressWidget">
      <div className="isoProgressWidgetTopbar">
        <h3>{label}</h3>
        {icon}
      </div>

      <div className="isoProgressWidgetBody">
        <p className="isoDescription">{details}</p>
        <Progress
          percent={percent}
          strokeWidth={barHeight}
          status={status}
          showInfo={false}
        />
      </div>
    </ProgressWidgetWrapper>
  );
}
