function Home(props) {
    return (
        <div className="bg-brand-gray min-h-screen font-sans">
            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-3xl font-bold text-brand-text">
                    Senior Guardian
                    </div>
                    <div className="flex items-center space-x-4">
                    <button
                        onClick={()=>{props.set_page("login")}}
                        className="text-lg font-bold text-brand-text py-3 px-6 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                    >
                        Login
                    </button>
                    <button
                        onClick={()=>{props.set_page("register")}}
                        className="text-lg font-bold text-white bg-brand-blue py-3 px-6 rounded-lg hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                    >
                        Register
                    </button>
                    </div>
                </nav>
            </header>
            <main>
                <section className="text-center py-20 px-6">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-bold text-brand-text mb-6">
                        Your Loved Ones, Always Safe.
                        </h1>
                        <p className="text-2xl text-gray-700 mb-12">
                        Our service uses existing home cameras to automatically detect falls. If a fall occurs, we instantly alert you and other emergency contacts.
                        </p>
                        <button
                        onClick={()=>{props.set_page("register")}}
                        className="inline-block bg-brand-green text-white font-bold text-2xl py-5 px-16 rounded-full shadow-lg hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
                        >
                        Register
                        </button>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Home