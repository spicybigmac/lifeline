"use client"

import React, { useRef, useState } from 'react';
import Monitor from './components/monitor';
import Home from './components/home';
import Register from './components/register';
import Login from './components/login';

const App: React.FC = () => {
    const [page, set_page] = useState("monitor");

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

    const renderView = () => {
        switch(page){
            case "home":
                return <Home set_page={set_page}/>;
            case "monitor":
                return <Monitor/>;
            case "register":
                return <Register />
            case "login":
                return <Login />
        }
    }

    return renderView();
};

export default App;