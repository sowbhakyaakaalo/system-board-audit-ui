import React from 'react';

export const CameraControls = ({ onStartCamera, onSwitchCamera, onCapture, onUpload, loading }) => {
  return (
    <div className="button-group">
      <label className="btn">
        {loading ? 'Processing…' : 'Upload & Detect'}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
        />
      </label>
      <button className="btn" onClick={onStartCamera}>Start Camera</button>
      <button className="btn" onClick={onCapture}>Capture & Detect</button>
      <button className="btn" onClick={onSwitchCamera}>Switch Camera</button>
    </div>
  );
};
