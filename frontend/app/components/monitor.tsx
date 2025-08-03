"use client";
import React, { useState, useRef, FC, ChangeEvent, useMemo, useEffect } from 'react';
import Webcam from 'react-webcam';

interface MonitorComponentProps {
    set_page: (page: string) => void;
    user: string;
}

const Monitor: FC<MonitorComponentProps> = ({ set_page, user }) => {
    const [profile, setProfile] = useState({
        fullName: '',
        address: '',
        age: '',
        conditions: '',
        emergencyContact: ''
    });
    const [isEditing, setIsEditing] = useState(true); 
    const [isLoadingProfile, setIsLoadingProfile] = useState(true); 

    const [isMonitoring, setIsMonitoring] = useState(false);
    const webcamRef = useRef<Webcam>(null);
    const analysisInterval = useRef<NodeJS.Timeout | null>(null);
    const [processedData, setProcessedData] = useState({ image: null, detections: [] });

    const interval_ms = 250;
    const threshold = 40;
    let fallCount = 0;

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setIsLoadingProfile(false);
                return;
            }
            
            try {
                const response = await fetch(`/api/saveinfo?username=${user}`);
                
                if (response.ok) {
                    const data = await response.json();
                    setProfile({
                        fullName: data.fullName || '',
                        address: data.address || '',
                        age: data.age || '',
                        conditions: data.conditions || '',
                        emergencyContact: data.emergencyContact || ''
                    });
                    setIsEditing(false); 
                } else {
                    console.log("No profile found for this user. Starting with a blank form.");
                    setIsEditing(true); 
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                alert("Could not load user profile. Please try again later.");
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [user]);

    const isProfileComplete = useMemo(() => {
        return Object.values(profile).every(value => String(value).trim() !== '');
    }, [profile]);

    const handleProfileChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        if (!isProfileComplete) {
            alert("Please fill out all fields before saving.");
            return;
        }
        try {
            const response = await fetch('/api/saveinfo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user, ...profile }),
            });
            if (response.ok) {
                setIsEditing(false);
                alert("Profile saved successfully!");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save profile.");
            }
        } catch (error) {
            console.error(error);
            alert(`An error occurred while saving: ${error}`);
        }
    };

    const analyzeFrame = async () => {
        if (!webcamRef.current) return;
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        try {
            const response = await fetch('http://127.0.0.1:8000/processImage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageSrc.split(',')[1] }),
            });

            if (!response.ok) throw new Error("Error processing image.");
            
            const data = await response.json();
            setProcessedData({ image: data[0], detections: data[1] });
            const hasFallen = data[1].some((d: any) => (d[5] === 0));

            if (hasFallen) {
                fallCount++;
                if (fallCount == threshold) {
                    console.log(`EMERGENCY: Fall detected! Contacting: ${profile.emergencyContact}`);
                    const response2 = await fetch('http://127.0.0.1:8000/emergencyCall', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: user, ...profile }),
                    });

                    if (!response2.ok) throw new Error("Error making call.");
                    stopMonitoring();
                }
            } else {
                fallCount = 0;
            }

        } catch (error) {
            console.error("Analysis Error:", error);
            stopMonitoring();
        }
    };

    const startMonitoring = () => {
        if (!isProfileComplete || isEditing) {
            alert("Please save the patient profile before starting the monitor.");
            return;
        }
        setIsMonitoring(true);
        analysisInterval.current = setInterval(analyzeFrame, interval_ms);
    };

    const stopMonitoring = () => {
        setIsMonitoring(false);
        if (analysisInterval.current) clearInterval(analysisInterval.current);
        setProcessedData({ image: null, detections: [] });
    };


    if (isLoadingProfile) {
        return <div className="auth-container"><h1>Loading Profile...</h1></div>;
    }

    return (
        <div className="page-container monitor-page">
            <button onClick={() => set_page('home')} className="monitor-back-button">
                ← Back to Home
            </button>
            
            <main>
                <h1>Live Monitor for <span style={{color: '#fff'}}>{user}</span></h1>
                <p>System is {isMonitoring ? "active" : "inactive"}. Please fill out and save the profile below to begin.</p>
                
                <div className="monitor-controls">
                    <button 
                        onClick={isMonitoring ? stopMonitoring : startMonitoring} 
                        className={`monitor-toggle ${isMonitoring ? 'stop' : 'start'}`}
                        disabled={isEditing || !isProfileComplete}
                    >
                        {isMonitoring ? "Stop Monitoring" : "Begin Monitoring"}
                    </button>
                </div>

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
                            <div className="webcam-placeholder">Monitoring is off</div>
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

                <div className="dashboard-section">
                    <div className="dashboard-form">
                        <h2>Patient Profile</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input type="text" id="fullName" name="fullName" value={profile.fullName} onChange={handleProfileChange} disabled={!isEditing} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="age">Age</label>
                                <input type="number" id="age" name="age" value={profile.age} onChange={handleProfileChange} disabled={!isEditing} />
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="address">Address</label>
                                <input type="text" id="address" name="address" value={profile.address} onChange={handleProfileChange} disabled={!isEditing} />
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="emergencyContact">Emergency Phone Number</label>
                                <input type="tel" id="emergencyContact" name="emergencyContact" value={profile.emergencyContact} onChange={handleProfileChange} disabled={!isEditing} />
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="conditions">Previous Medical Conditions</label>
                                <textarea id="conditions" name="conditions" rows={4} value={profile.conditions} onChange={handleProfileChange} disabled={!isEditing}></textarea>
                            </div>
                        </div>
                        <div className="dashboard-actions">
                            {isEditing ? (
                                <button onClick={handleSave} disabled={!isProfileComplete}>Save Profile</button>
                            ) : (
                                <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Monitor;