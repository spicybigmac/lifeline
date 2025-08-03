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
                d="M-4000 150 L100 150 L105 130 L120 190 L130 90 L140 150 L160 150 L165 170 L170 130 L180 180 L188 140 L195 150 L4000 150"
                stroke="#ff3b3b" /* Use a solid color now */
                strokeWidth="5"
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