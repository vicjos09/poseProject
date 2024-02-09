import React, { useState, useEffect } from 'react';

const CameraComponent = () => {
  const [mediaStream, setMediaStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setMediaStream(stream);
      } catch (err) {
        setError(err);
      }
    };

    const stopCamera = () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, []); // Se pasa un arreglo vacío para asegurar que el efecto se ejecute solo una vez

  return (
    <>
      {error && <p>{error.message}</p>}
      <div style={{ borderRadius: '8px', overflow: 'hidden', width: '100%' }}>
        {mediaStream && <video autoPlay style={{ width: '100%', borderRadius: '8px', maxWidth: '100%' }} ref={video => video && (video.srcObject = mediaStream)} />}
      </div>
    </>
  );
};

export default CameraComponent;
