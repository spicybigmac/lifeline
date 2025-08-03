// app/components/Monitor.tsx
"use client";
import React, { useState, useRef, FC } from 'react';
import Webcam from 'react-webcam';

// Define props to include the navigation function
interface MonitorComponentProps {
    set_page: (page: string) => void;
}

// Define props to include the navigation function
interface MonitorComponentProps {
    set_page: (page: string) => void;
}

const Monitor: FC<MonitorComponentProps><MonitorComponentProps> = ({ set_page }{ set_page }) => {
    const [isMonitoring, setIsMonitoring] = useState(false);
    const webcamRef = useRef<Webcam>(null);
    const analysisInterval = useRef<NodeJS.Timeout | null>(null);
    const [processedData, setProcessedData] = useState<{ image: string | null; detections: any[] }>({ image: null, detections: [] });
    const fallCounter = useRef(0);
    const FALL_THRESHOLD = 5;
    const ANALYSIS_INTERVAL_MS = 500;

    const analyzeFrame = async () => {
        if (!webcamRef.current) return;
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        try {
            const response = await fetch('http://127.0.0.1:8000/detect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageSrc.split(',')[1] }),
            });

            if (!response.ok) throw new Error("Error processing image.");
            
            const data = await response.json();
            setProcessedData({ image: data.image, detections: data.detections });

            const hasFallen = data.detections.some((d: any) => d.class_name === 'fallen_person');

            if (hasFallen) {
                fallCounter.current++;
            } else {
                fallCounter.current = 0;
            }

            if (fallCounter.current >= FALL_THRESHOLD) {
                console.log("EMERGENCY: Fall detected!");
                stopMonitoring();
            }
        } catch (error) {
            console.error("Analysis Error:", error);
            stopMonitoring();
        }
    };

    const startMonitoring = () => {
        setIsMonitoring(true);
        fallCounter.current = 0;
        analysisInterval.current = setInterval(analyzeFrame, ANALYSIS_INTERVAL_MS);
    };

    const stopMonitoring = () => {
        setIsMonitoring(false);
        if (analysisInterval.current) {
            clearInterval(analysisInterval.current);
        }
        setProcessedData({ image: null, detections: [] });
    };

    const toggleMonitoring = () => {
        isMonitoring ? stopMonitoring() : startMonitoring();
    };

    return (
        <div className="page-container monitor-page">
            {/* The Back Button, positioned via CSS */}
            <button onClick={() => set_page('home')} className="monitor-back-button">
                ← Back to Home
            </button>
            
            {/* The Back Button, positioned via CSS */}
            <button onClick={() => set_page('home')} className="monitor-back-button">
                ← Back to Home
            </button>
            
            <main>
                <h1>Live Monitor</h1>
                <p>System is {isMonitoring ? "active" : "inactive"}. Press Start to begin monitoring.</p>
                <div className="video-container">
                    <div className="video-item source-view">
                        <h3>Camera Feed</h3>
                        {isMonitoring ? (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
                            />
                        ) : (
                            <div className="webcam-placeholder">Camera is off</div>
                        )}
                    </div>
                    <div className="video-item analyzed-view">
                        <h3>Analyzed View</h3>
                        {isMonitoring && processedData.image ? (
                            <img src={`data:image/jpeg;base64,${processedData.image}`} alt="Analyzed frame" />
                        ) : (
                            <div className="webcam-placeholder">Awaiting analysis...</div>
                        )}
                    </div>
                </div>
                <button onClick={toggleMonitoring} className={`monitor-toggle ${isMonitoring ? 'stop' : 'start'}`}>
                    {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
                </button>
            </main>
        </div>
    );
};

export default Monitor;