"use client"

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

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
                return (
                    <div className="bg-brand-gray min-h-screen font-sans">
                        <header className="bg-white shadow-md">
                            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                                <div className="text-3xl font-bold text-brand-text">
                                Senior Guardian
                                </div>
                                <div className="flex items-center space-x-4">
                                <button
                                    onClick={()=>{set_page("login")}}
                                    className="text-lg font-bold text-brand-text py-3 px-6 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={()=>{set_page("register")}}
                                    className="text-lg font-bold text-white bg-brand-blue py-3 px-6 rounded-lg hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                                >
                                    Register
                                </button>
                                </div>
                            </nav>
                        </header>
                        <main>
                            <section className="text-center py-20 px-6">
                                <div className="max-w-4xl mx-auto">
                                    <h1 className="text-5xl md:text-6xl font-bold text-brand-text mb-6">
                                    Your Loved Ones, Always Safe.
                                    </h1>
                                    <p className="text-2xl text-gray-700 mb-12">
                                    Our service uses existing home cameras to automatically detect falls. If a fall occurs, we instantly alert you and other emergency contacts.
                                    </p>
                                    <button
                                    onClick={()=>{set_page("register")}}
                                    className="inline-block bg-brand-green text-white font-bold text-2xl py-5 px-16 rounded-full shadow-lg hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
                                    >
                                    Register
                                    </button>
                                </div>
                            </section>
                        </main>
                    </div>
                )
            case "monitor":
                return (
                    <div>
                        <div className="camView">
                            {show &&
                                <Webcam 
                                    audio={false} 
                                    ref={video_element} 
                                    videoConstraints={videoConstraints} 
                                    screenshotFormat="image/jpeg" 
                                />
                            }
                        </div>
                        <button onClick={toggle}>{show ? "Stop" : "Start"}</button>
            
                        <div className="analyzed">
                            <img src={data ? `data:image/jpeg;base64,${data[0]}` : undefined} />
                        </div>
                    </div>
                )
            case "register":
                return (
                    <div className="flex items-center justify-center min-h-screen bg-brand-gray">
                        <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-xl">
                            <div className="text-center">
                            <h1 className="text-4xl font-bold text-brand-text mb-2">
                                Welcome
                            </h1>
                            <p className="text-xl text-gray-600">
                                Please enter your details to register.
                            </p>
                            </div>

                            <form className="space-y-8">
                            {/* Username Input */}
                            <div>
                                <label 
                                htmlFor="username" 
                                className="block text-2xl font-bold text-gray-700 mb-2"
                                >
                                Username
                                </label>
                                <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="w-full px-4 py-4 text-xl text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                placeholder="Enter your username"
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <label 
                                htmlFor="password" 
                                className="block text-2xl font-bold text-gray-700 mb-2"
                                >
                                Password
                                </label>
                                <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-4 text-xl text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                placeholder="Enter your password"
                                />
                            </div>

                            {/* Register Button */}
                            <button
                                onClick={()=>{
                                    
                                }}
                                type="button"
                                className="w-full py-5 text-2xl font-bold text-white bg-brand-green rounded-lg shadow-lg hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
                            >
                                Register
                            </button>
                            </form>
                        </div>
                    </div>
                )
            case "login":
                return (
                    <div className="flex items-center justify-center min-h-screen bg-brand-gray">
                        <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-xl">
                            <div className="text-center">
                            <h1 className="text-4xl font-bold text-brand-text mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-xl text-gray-600">
                                Please enter your details to log in.
                            </p>
                            </div>

                            <form className="space-y-8">
                            {/* Username Input */}
                            <div>
                                <label 
                                htmlFor="username" 
                                className="block text-2xl font-bold text-gray-700 mb-2"
                                >
                                Username
                                </label>
                                <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="w-full px-4 py-4 text-xl text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                placeholder="Enter your username"
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <label 
                                htmlFor="password" 
                                className="block text-2xl font-bold text-gray-700 mb-2"
                                >
                                Password
                                </label>
                                <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-4 text-xl text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                                placeholder="Enter your password"
                                />
                            </div>

                            {/* Login Button */}
                            <button
                                onClick={()=>{
                                    
                                }}
                                type="button"
                                className="w-full py-5 text-2xl font-bold text-white bg-brand-green rounded-lg shadow-lg hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
                            >
                                Login
                            </button>
                            </form>
                        </div>
                    </div>
                )
        }
    }

    return renderView();
};

export default App;