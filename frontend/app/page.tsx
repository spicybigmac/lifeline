"use client"

import React, { useRef, useState } from 'react';
import Monitor from './components/monitor';
import Home from './components/home';
import Register from './components/register';
import Login from './components/login';

const App: React.FC = () => {
    const [page, set_page] = useState("home");

    const [show, set_show] = useState(false);
    const video_element = useRef(null);
    const interval = useRef(null);
    const [data, set_data] = useState(null);
    let counter = 0;
    const threshold = 10;
    
    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user"
    }

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setMessage('');

    //     const endpoint = isLogin ? '/api/login' : '/api/register';

    //     try {
    //     const response = await fetch(endpoint, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ email, password }),
    //     });

    //     const data = await response.json();
        
    //     setMessage(data.message);

    //     } catch (error) {
    //     setMessage('An unexpected error occurred.');
    //     }
    // };
    
    const analyze = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/processImage', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({image: String(video_element.current.getScreenshot())}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error processing image.");
            }

            const dat = await response.json();
            set_data(dat);

            var has_fallen = false;
            dat[1].forEach((result: number[]) => {
                has_fallen ||= (result[5] == 0);
            })

            if(has_fallen){
                ++counter;
            } else {
                counter = 0;
            }
            
            if(counter == threshold){
                await fetch('http://127.0.0.1:8000/emergencyCall', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: "",
                });

                stopCam();
            }
            
        } catch (error) {
            console.error("Error during processing:", error);
            alert("Error during processing.");
        }
    }

    const startCam = () => {
        set_show(true);
        interval.current = setInterval(analyze, 1000);
    }

    const stopCam = () => {
        let stream = video_element.current.stream;
        const tracks = stream.getTracks();
        tracks.forEach((track: { stop: () => any; }) => track.stop());
        set_show(false);

        clearInterval(interval.current);
        interval.current = null

        set_data(null);
    }

    const toggle = () => {
        if(show){
        stopCam();
        } else {
        startCam();
        }
    }

    const renderView = () => {
        switch(page){
            case "home":
                return <Home set_page={set_page}/>;
            case "monitor":
                return <Monitor show={show} video_element={video_element} videoConstraints={videoConstraints} toggle={toggle} data={data} />;
            case "register":
                return <Register />
            case "login":
                return <Login />
        }
    }

    return renderView();
};

export default App;