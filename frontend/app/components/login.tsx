import { useState } from 'react';

function Login(props) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        const endpoint = '/api/login';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, password }),
            });

            const data = await response.json();

            setMessage(data.message);
            if (response.status === 200) {
                props.set_user(name)
                props.set_page("monitor")
            }

        } catch (error) {
            setMessage('An unexpected error occurred.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-gray">
            <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-xl">
                <div className="text-center">
                <h1 className="text-4xl font-bold text-brand-text mb-2">
                    Welcome
                </h1>
                <p className="text-xl text-gray-600">
                    Please enter your details to log in.
                </p>
                </div>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* Username Input */}
                    <div>
                        <label 
                        htmlFor="username" 
                        className="block text-2xl font-bold text-gray-700 mb-2"
                        >
                        Username
                        </label>
                        <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
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
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-4 text-xl text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        placeholder="Enter your password"
                        />
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="w-full py-5 text-2xl font-bold text-white bg-brand-green rounded-lg shadow-lg hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
                    >
                        Log In
                    </button>
                </form>

                {message && <p style={{ marginTop: '1rem', color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
            </div>
        </div>
    )
}

export default Login