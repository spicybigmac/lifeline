"use client";

import React, { useState, FC } from 'react';
import Home from './components/home';
import Register from './components/register';
import Login from './components/login';
import Monitor from './components/monitor';

const HeartbeatAnimation: FC = () => (
    <div className="heartbeat-bg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 300">
            <path
                d="M0 150 L300 150 L305 130 L320 190 L330 90 L340 150 L360 150 L365 170 L370 130 L380 180 L388 140 L395 150 L595 150"
                stroke="#960000ff"
                strokeWidth="1"
                fill="none"
            />
        </svg>
    </div>
);

const ColumnAnimation: FC = () => (
    <div className="column-bg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 300" preserveAspectRatio="xMidYMid meet">
            <path
                d="M0 0 L0 300 M20 0 L20 300 M40 0 L40 300 M60 0 L60 300 M80 0 L80 300 M100 0 L100 300 M120 0 L120 300 M140 0 L140 300 M160 0 L160 300 M180 0 L180 300 M200 0 L200 300 M220 0 L220 300 M240 0 L240 300 M260 0 L260 300 M280 0 L280 300 M300 0 L300 300 M320 0 L320 300 M340 0 L340 300 M360 0 L360 300 M380 0 L380 300 M400 0 L400 300 M420 0 L420 300 M440 0 L440 300 M460 0 L460 300 M480 0 L480 300 M500 0 L500 300 M520 0 L520 300 M540 0 L540 300 M560 0 L560 300 M580 0 L580 300 M600 0 L600 300 M620 0 L620 300 M640 0 L640 300 M660 0 L660 300 M680 0 L680 300"
                stroke="#290000ff"
                strokeWidth="1"
                fill="none"
            />
        </svg>
    </div>
)

const RowAnimation: FC = () => (
    <div className="row-bg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 300" preserveAspectRatio="xMidYMid meet">
            <path
                d="M0 0 L2000 0 M0 20 L2000 20 M0 40 L2000 40 M0 60 L2000 60 M0 80 L2000 80 M0 100 L2000 100 M0 120 L2000 120 M0 140 L2000 140 M0 160 L2000 160 M0 180 L2000 180 M0 200 L2000 200 M0 220 L2000 220 M0 240 L2000 240 M0 260 L2000 260 M0 280 L2000 280 M0 300 L2000 300 M0 320 L2000 320 M0 340 L2000 340 M0 360 L2000 360 M0 380 L2000 380 M0 400 L2000 400 M0 420 L2000 420 M0 440 L2000 440 M0 460 L2000 460 M0 480 L2000 480 M0 500 L2000 500 M0 520 L2000 520 M0 540 L2000 540 M0 560 L2000 560 M0 580 L2000 580"
                stroke="#290000ff"
                strokeWidth="1"
                fill="none"
            />
        </svg>
    </div>
)

const App: FC = () => {
    const [page, setPage] = useState("home");
    const [user, setUser] = useState("");

    const renderView = () => {
        switch (page) {
            case "home":
                return <Home set_page={setPage} />;
            case "monitor":
                return <Monitor set_page={setPage} user={user} />;
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
            <RowAnimation />
            <ColumnAnimation />
            <HeartbeatAnimation />
            {renderView()}
        </>
    );
};

export default App;