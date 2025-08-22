import React from 'react';

export const DetectionCard = ({ title, status }) => {
  // status values expected: 'Connected', 'Disconnected', anything else => Not Detected (orange)
  const colorClass =
    status === 'Connected' ? 'green' :
    status === 'Disconnected' ? 'red' : 'orange';

  return (
    <div className={`result-box ${colorClass}`}>
      {title}: {status || 'Not Detected'}
    </div>
  );
};
