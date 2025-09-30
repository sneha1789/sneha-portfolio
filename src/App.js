import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AdminCMS from './components/AdminCMS';
import Particles from './components/Particles'; // Add this import
import './App.css';

function Portfolio() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className="App">
            <Particles /> {/* Add Particles component here */}
            <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
            <Footer />
            <Chatbot />
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route path="/admin" element={<AdminCMS />} />
            </Routes>
        </Router>
    );
}

export default App;