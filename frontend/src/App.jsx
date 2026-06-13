import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ComplaintForm from "./pages/ComplaintForm";
import Results from "./pages/Results";
import History from "./pages/History";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/report"
                    element={<ComplaintForm />}
                />

                <Route
                    path="/results"
                    element={<Results />}
                />

                <Route
                    path="/history"
                    element={<History />}
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;