import React, { useState, useEffect, useRef } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl'; // O utiliza otro backend como 'tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-cpu';

const CameraComponent = () => {
  const [mediaStream, setMediaStream] = useState(null);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

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
  }, []);

  useEffect(() => {
    const runPoseDetection = async () => {
      const detector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose);
      if (detector && mediaStream) {
        const video = document.createElement('video');
        video.srcObject = mediaStream;
        video.play();
        const context = canvasRef.current.getContext('2d');

        const detectPose = async () => {
          const poses = await detector.estimatePoses(video);
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          poses.forEach(pose => {
            const keypoints = pose.keypoints;
            for (let i = 0; i < keypoints.length; i++) {
              const { x, y } = keypoints[i].position;
              console.log(`Articulación ${i}: x=${x}, y=${y}`); // Imprimir valores en la consola
              context.beginPath();
              context.arc(x, y, 5, 0, 2 * Math.PI);
              context.fillStyle = 'red';
              context.fill();
            }
            for (let i = 0; i < pose.connections.length; i++) {
              const [start, end] = pose.connections[i];
              const startX = keypoints[start].position.x;
              const startY = keypoints[start].position.y;
              const endX = keypoints[end].position.x;
              const endY = keypoints[end].position.y;
              context.beginPath();
              context.moveTo(startX, startY);
              context.lineTo(endX, endY);
              context.lineWidth = 2;
              context.strokeStyle = 'red';
              context.stroke();
            }
          });
          requestAnimationFrame(detectPose);
        };

        detectPose();
      }
    };

    runPoseDetection();
  }, [mediaStream]);

  return (
    <>
      {error && <p>{error.message}</p>}
      <div style={{ borderRadius: '8px', overflow: 'hidden', width: '100%' }}>
        {mediaStream && <video autoPlay style={{ width: '100%', borderRadius: '12px', maxWidth: '100%' }} ref={video => video && (video.srcObject = mediaStream)} />}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </>
  );
};

export default CameraComponent;
