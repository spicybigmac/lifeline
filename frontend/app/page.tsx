"use client";

import React, { useState, FC } from 'react';
import Home from './components/home';
import Register from './components/register';
import Login from './components/login';
import Monitor from './components/monitor';

const HeartbeatAnimation: FC = () => (
    <div className="heartbeat-bg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2800 300">
            <defs>
                <linearGradient id="fade-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff3b3b" stopOpacity="1" />
                    <stop offset="60%" stopColor="#ff3b3b" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ff3b3b" stopOpacity="1" />
                </linearGradient>
            </defs>
            <g className="heartbeat-line-group">
                <path
                    d="M-4000 150 L100 150 L105 130 L120 190 L130 90 L140 150 L160 150 L165 170 L170 130 L180 180 L188 140 L195 150 L4000 150"
                    stroke="url(#fade-gradient)"
                    strokeWidth="2"
                    fill="none"
                />
            </g>
        </svg>
    </div>
);


const App: FC = () => {
    const [page, setPage] = useState("home");
    const [user, setUser] = useState("");

    const renderView = () => {
        switch (page) {
            case "home":
                return <Home set_page={setPage} />;
            case "monitor":
                return <Monitor />;
            case "register":
                return <Register set_page={setPage} set_user={setUser} />;
            case "login":
                return <Login set_page={setPage} set_user={setUser} />;
            default:
                return <Home set_page={setPage} />;
        }
    };

    return (
        <>
            <HeartbeatAnimation />
            {renderView()}
        </>
    );
};

export default App;