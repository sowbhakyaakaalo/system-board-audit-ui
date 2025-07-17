import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [resultText, setResultText] = useState('');
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const videoRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    await sendToBackend(file);
  };

  const sendToBackend = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    // Handle status
    const boxes = data?.boxes || [];
    if (boxes.length === 0) {
      setResultText('Not Detected ⚠️');
    } else {
      const classes = boxes.map(box => box.class.toLowerCase());
      if (classes.includes('disconnect')) {
        setResultText('Disconnected ❌');
      } else if (classes.includes('connect')) {
        setResultText('Connected ✅');
      } else {
        setResultText('Not Detected ⚠️');
      }
    }

    setAnnotatedImage(`data:image/png;base64,${data.image}`);
  };

  const handleCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode },
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    handleCamera();
  };

  const captureAndDetect = async () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      setImage(URL.createObjectURL(file));
      sendToBackend(file);
    }, 'image/jpeg');
  };

  return (
    <div className="app-container">
      <h1>🔍 System Board Audit</h1>

      <div className="button-group">
        <label className="btn">
          Upload & Detect
          <input type="file" accept="image/*" hidden onChange={handleFileChange} />
        </label>

        <button className="btn" onClick={handleCamera}>Camera</button>
        <button className="btn" onClick={switchCamera}>Switch Camera</button>
      </div>

      <div className="preview-container">
        {image && !annotatedImage && <img src={image} alt="Preview" className="preview" />}
        {annotatedImage && <img src={annotatedImage} alt="Detected" className="preview" />}
        <video ref={videoRef} autoPlay playsInline className="preview" style={{ display: image ? "none" : "block" }}></video>
      </div>

      <div className={`result-box ${resultText.toLowerCase().includes('connected') ? 'green' : resultText.toLowerCase().includes('disconnected') ? 'red' : 'orange'}`}>
        Battery Cable: {resultText}
      </div>

      {videoRef.current?.srcObject && (
        <button className="detect-btn" onClick={captureAndDetect}>📷 Capture & Detect</button>
      )}
    </div>
  );
}

export default App;
