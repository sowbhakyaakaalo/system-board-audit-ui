import React from 'react';

export const CameraControls = ({ onStartCamera, onSwitchCamera, onCapture, onUpload, loading }) => {
  return (
    <div className="button-group">
      <label className={`btn ${loading ? 'disabled' : ''}`}>
        {loading ? 'Processing…' : 'Upload & Detect'}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
          disabled={loading}
        />
      </label>

      <button className="btn" onClick={onStartCamera} disabled={loading}>
        {loading ? 'Please wait…' : 'Start Camera'}
      </button>

      <button className="btn" onClick={onCapture} disabled={loading}>
        {loading ? 'Capturing…' : 'Capture & Detect'}
      </button>

      <button className="btn" onClick={onSwitchCamera} disabled={loading}>
        Switch Camera
      </button>
    </div>
  );
};

