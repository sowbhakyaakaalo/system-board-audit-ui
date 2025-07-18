import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [imagePreview, setImagePreview] = useState(null);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [batteryStatus, setBatteryStatus] = useState('');
  const [ledStatus, setLedStatus] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const videoRef = useRef(null);

  useEffect(() => {
    if (streaming) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode } }).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    }
  }, [streaming, facingMode]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setAnnotatedImage(null);
    await sendToBackend(file);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      setImagePreview(URL.createObjectURL(file));
      sendToBackend(file);
    }, 'image/jpeg');
  };

  const sendToBackend = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('https://system-board-audit-backend.onrender.com/predict/', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setBatteryStatus(data.battery_status);
    setLedStatus(data.led_status);
    setAnnotatedImage(`data:image/png;base64,${data.image}`);
  };

  const getStatusColor = (status) => {
    if (status === 'Connected') return 'green';
    if (status === 'Disconnected') return 'red';
    return 'orange';
  };

  return (
    <div className="app-container">
      <h1>System Board Audit</h1>
      <div className="button-group">
        <label className="btn">
          Upload & Detect
          <input type="file" accept="image/*" hidden onChange={handleFileChange} />
        </label>
        <button className="btn" onClick={captureImage}>Capture & Detect</button>
        <button className="btn" onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}>
          Switch Camera
        </button>
      </div>
      <div className="preview-container">
        {annotatedImage ? (
          <img src={annotatedImage} alt="Detected" className="preview" />
        ) : imagePreview ? (
          <img src={imagePreview} alt="Preview" className="preview" />
        ) : (
          <video ref={videoRef} autoPlay playsInline className="preview" />
        )}
      </div>
      <div className="results-container">
        {batteryStatus && (
          <div className={`result-box ${getStatusColor(batteryStatus)}`}>
            Battery Cable: {batteryStatus}
          </div>
        )}
        {ledStatus && (
          <div className={`result-box ${getStatusColor(ledStatus)}`}>
            LED Board Cable: {ledStatus}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
