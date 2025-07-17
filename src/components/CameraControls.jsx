import React from 'react';

export const CameraControls = ({ onSwitchCamera, onCapture, onUpload }) => {
  return (
    <div className="buttons">
      <button onClick={onSwitchCamera}>Switch Camera</button>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        id="upload"
        onChange={(e) => {
          if (e.target.files.length > 0) {
            onUpload(e.target.files[0]);
          }
        }}
      />
      <label htmlFor="upload">
        <button>Upload Image</button>
      </label>
      <button onClick={onCapture}>Capture & Detect</button>
    </div>
  );
};
