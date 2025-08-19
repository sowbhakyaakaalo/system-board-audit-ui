import React from 'react';

export const DetectionCard = ({ title, status }) => {
  const colorClass =
    status === 'Connected' ? 'green' :
    status === 'Disconnected' ? 'red' : 'orange';

  return (
    <div className={`result-box ${colorClass}`}>
      {title}: {status || 'Not Detected'}
    </div>
  );
};
