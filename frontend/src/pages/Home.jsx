import Navbar from "../components/Navbar";

function Home() {
    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

                <div className="text-center">

                    <h1 className="text-6xl font-bold">
                        CivicLens
                    </h1>

                    <p className="text-slate-400 mt-6 text-xl">
                        AI Powered Civic Intelligence System
                    </p>

                </div>

            </div>
        </>
    );
}

export default Home;