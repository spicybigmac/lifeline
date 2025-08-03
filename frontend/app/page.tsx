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
                    <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0" />
                    <stop offset="60%" stopColor="#ff1b1b" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ff3b3b" stopOpacity="1" />
                </linearGradient>
            </defs>
            <g className="heartbeat-line-group">
                <path
                    d="M-400,150 L300,150 Q325,120 350,150 L400,150 L420,170 L450,50 L480,250 L500,150 L550,150 Q575,120 600,150 L1000,150 L1020,170 L1050,50 L1080,250 L1100,150 L1150,150 Q1175,120 1200,150 L1600,150 L1620,170 L1650,50 L1680,250 L1700,150 L1750,150 Q1775,120 1800,150 L2800,150"
                    stroke="url(#fade-gradient)"
                    strokeWidth="5"
                    fill="none"
                />
                <circle cx="950" cy="150" r="10" fill="#ff4d4d" className="heartbeat-dot" />
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