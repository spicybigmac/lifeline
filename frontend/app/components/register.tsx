function Register(props) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-gray">
            <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-xl">
                <div className="text-center">
                <h1 className="text-4xl font-bold text-brand-text mb-2">
                    Welcome
                </h1>
                <p className="text-xl text-gray-600">
                    Please enter your details to register.
                </p>
                </div>

                <form className="space-y-8">
                {/* Username Input */}
                <div>
                    <label 
                    htmlFor="username" 
                    className="block text-2xl font-bold text-gray-700 mb-2"
                    >
                    Username
                    </label>
                    <input
                    id="username"
                    name="username"
                    type="text"
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
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-4 text-xl text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    placeholder="Enter your password"
                    />
                </div>

                {/* Register Button */}
                <button
                    onClick={()=>{
                        
                    }}
                    type="button"
                    className="w-full py-5 text-2xl font-bold text-white bg-brand-green rounded-lg shadow-lg hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
                >
                    Register
                </button>
                </form>
            </div>
        </div>
    )
}

export default Register