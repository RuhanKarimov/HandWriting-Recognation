import { Routes, Route } from "react-router-dom";
import Upload from "./pages/Upload";
import Result from "./pages/Result";
import Home from "./pages/Home";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />

            <main className="flex-fill">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/result" element={<Result />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<div className="container mt-5">404 - Sayfa bulunamadı</div>} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App;
