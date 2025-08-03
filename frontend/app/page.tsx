"use client";

import React, { useState, FC } from 'react';
import Home from './components/home';
import Register from './components/register';
import Login from './components/login';
import Monitor from './components/monitor';

const HeartbeatAnimation: FC = () => (
    <div className="heartbeat-bg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 300">
            {/* The path is now static. The CSS mask will reveal it. */}
            <path
                d="M0 150 L300 150 L305 130 L320 190 L330 90 L340 150 L360 150 L365 170 L370 130 L380 180 L388 140 L395 150 L595 150"
                stroke="#960000ff" /* Use a solid color now */
                strokeWidth="1"
                fill="none"
            />
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
                return <Monitor set_page={setPage}/>;
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