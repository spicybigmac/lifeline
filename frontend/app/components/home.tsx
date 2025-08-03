"use client";
import React, { FC } from 'react';

interface HomeComponentProps {
    set_page: (page: string) => void;
}

const Home: FC<HomeComponentProps> = ({ set_page }) => {
    return (
        <div className="page-container">
            <header className="navbar">
                <div className="nav-brand">LifeLine</div>
                <div className="nav-links">
                    <button onClick={() => { set_page("login") }}>Login</button>
                    <button onClick={() => { set_page("register") }} className="primary">Register</button>
                </div>
            </header>
            <main className="hero-section">
                <div className="hero-content">
                    <h1>Your Loved Ones, Always Safe.</h1>
                    <p>
                        Using computer vision and AI-powered phone calls, <b>LifeLine</b> ensures the safety of loved ones when they fall and can't get up on their own.
                    </p>
                    <button onClick={() => { set_page("register") }} className="cta-button">
                        Get Started Now
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Home;