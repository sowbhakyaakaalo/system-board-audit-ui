import React from 'react';

export const DetectionCard = ({ title, result }) => {
  let status = 'Not Detected';
  if (result?.results?.length > 0) {
    const label = result.results[0].class;
    status = label === 'Connected' ? 'Connected' : 'Disconnected';
  }

  const color =
    status === 'Connected' ? 'green' :
    status === 'Disconnected' ? 'red' : 'grey';

  return (
    <div className="detection-card" style={{ borderColor: color }}>
      <h3>{title}</h3>
      <p style={{ color }}>{status}</p>
    </div>
  );
};
