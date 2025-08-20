import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { CameraControls } from './components/CameraControls';
import { DetectionCard } from './components/DetectionCard';

const API_URL = import.meta.env.VITE_API_URL || 'https://system-board-audit-backend.onrender.com';

function App() {
  const [imagePreview, setImagePreview] = useState(null);
  const [annotatedImage, setAnnotatedImage] = useState(null);

  // 8 statuses
  const [batteryStatus, setBatteryStatus] = useState('');
  const [ledStatus, setLedStatus] = useState('');
  const [displayStatus, setDisplayStatus] = useState('');
  const [fanStatus, setFanStatus] = useState('');
  const [speakerStatus, setSpeakerStatus] = useState('');
  const [wifiStatus, setWifiStatus] = useState('');
  const [ethernetStatus, setEthernetStatus] = useState('');
  const [ramStatus, setRamStatus] = useState('');

  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const videoRef = useRef(null);

  useEffect(() => {
    if (!streaming) return;
    navigator.mediaDevices.getUserMedia({ video: { facingMode } })
      .then((stream) => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(console.error);
  }, [streaming, facingMode]);

  const startCamera = () => setStreaming(true);
  const switchCamera = () => setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));

  const handleUpload = async (file) => {
    setImagePreview(URL.createObjectURL(file));
    setAnnotatedImage(null);
    await sendToBackend(file);
  };

  const captureImage = () => {
    if (!videoRef.current) return;
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
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/predict/`, { method: 'POST', body: formData });
      const data = await res.json();

      // map all 8
      setBatteryStatus(data.battery_status || 'Not Detected');
      setLedStatus(data.led_status || 'Not Detected');
      setDisplayStatus(data.display_status || 'Not Detected');
      setFanStatus(data.fan_status || 'Not Detected');
      setSpeakerStatus(data.speaker_status || 'Not Detected');
      setWifiStatus(data.wifi_status || 'Not Detected');
      setEthernetStatus(data.ethernet_status || 'Not Detected');
      setRamStatus(data.ram_status || 'Not Detected');

      if (data.image) setAnnotatedImage(`data:image/png;base64,${data.image}`);
    } catch (e) {
      console.error(e);
      setBatteryStatus('Not Detected');
      setLedStatus('Not Detected');
      setDisplayStatus('Not Detected');
      setFanStatus('Not Detected');
      setSpeakerStatus('Not Detected');
      setWifiStatus('Not Detected');
      setEthernetStatus('Not Detected');
      setRamStatus('Not Detected');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>System Board Audit</h1>

      <CameraControls
        onStartCamera={startCamera}
        onSwitchCamera={switchCamera}
        onCapture={captureImage}
        onUpload={handleUpload}
        loading={loading}
      />

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
        <DetectionCard title="Battery Cable" status={batteryStatus} />
        <DetectionCard title="LED Board Cable" status={ledStatus} />
        <DetectionCard title="Display Cable" status={displayStatus} />
        <DetectionCard title="Fan Cable" status={fanStatus} />
        <DetectionCard title="Speaker Cable" status={speakerStatus} />
        <DetectionCard title="WiFi Cable" status={wifiStatus} />
        <DetectionCard title="Ethernet Cable" status={ethernetStatus} />
        <DetectionCard title="RAM Slot" status={ramStatus} />
      </div>
    </div>
  );
}

export default App;

