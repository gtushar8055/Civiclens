import { Link } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

function Navbar() {

    return (

        <nav className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

                {/* Logo */}

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >

                    <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">

                        <BrainCircuit
                            size={24}
                            className="text-white"
                        />

                    </div>

                    <div>

                        <h1 className="text-2xl font-bold">
                            CivicLens
                        </h1>

                        <p className="text-xs text-slate-400">
                            AI Powered Civic Intelligence
                        </p>

                    </div>

                </Link>

                {/* Navigation */}

                <div className="flex items-center gap-8">

                    <Link
                        to="/"
                        className="text-slate-300 hover:text-white transition"
                    >
                        Home
                    </Link>

                    <Link
                        to="/history"
                        className="text-slate-300 hover:text-white transition"
                    >
                        History
                    </Link>

                    <Link
                        to="/report"
                        className="bg-blue-600 hover:bg-blue-500 transition px-5 py-3 rounded-xl font-medium"
                    >
                        Report Complaint
                    </Link>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;