"use client";
import React, { useState, FC, FormEvent } from 'react';

interface AuthComponentProps {
    set_page: (page: string) => void;
    set_user: (user: string) => void;
}

const Login: FC<AuthComponentProps> = ({ set_page, set_user }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password }),
            });
            const data = await response.json();
            setMessage(data.message);
            if (response.ok) {
                set_user(name);
                set_page("monitor");
            }
        } catch (error) {
            setMessage('An unexpected error occurred.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-wrapper">
                <h1>Welcome Back</h1>
                <p>Sign in to access your monitor.</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" onChange={(e) => setName(e.target.value)} required />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
                {message && <p className={`form-message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</p>}
                <div className="auth-links">
                    <button className="link-button" onClick={() => set_page('home')}>← Back to Home</button>
                    <button className="link-button" onClick={() => set_page('register')}>Need an account?</button>
                </div>
            </div>
        </div>
    );
};

export default Login;