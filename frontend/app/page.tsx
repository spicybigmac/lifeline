"use client"

import React, { useState } from 'react';
import Monitor from './components/monitor';
import Home from './components/home';
import Register from './components/register';
import Login from './components/login';

const App: React.FC = () => {
    const [page, set_page] = useState("home");
    const [user, set_user] = useState("")

    const renderView = () => {
        console.log(page)
        switch(page){
            case "home":
                return <Home set_page={set_page}/>;
            case "monitor":
                return <Monitor/>;
            case "register":
                return <Register set_page={set_page} set_user={set_user} />
            case "login":
                return <Login set_page={set_page} set_user={set_user} />
        }
    }

    return renderView();
};

export default App;