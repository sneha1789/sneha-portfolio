import React from 'react';
import '../styles/components/navbar.css';

const Navbar = ({ isDarkMode, toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.classList.toggle('menu-open');
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.classList.remove('menu-open');
    };

    const handleNavClick = (e, sectionId) => {
        e.preventDefault();
        closeMenu();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <a href="#home" className="logo" onClick={(e) => handleNavClick(e, 'home')}>
                    <img 
                        src={isDarkMode ? "/assets/images/logo-dark.png" : "/assets/images/logo-light.png"} 
                        alt="Sneha Khatoon Logo" 
                    />
                </a>
                
                <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="navMenu">
                    <ul className="nav-links">
                        <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a></li>
                        <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a></li>
                        <li><a href="#skills" onClick={(e) => handleNavClick(e, 'skills')}>Skills</a></li>
                        <li><a href="#projects" onClick={(e) => handleNavClick(e, 'projects')}>Projects</a></li>
                        <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a></li>
                    </ul>
                    
                    <div className="theme-toggle nav-theme-toggle" onClick={toggleTheme}>
                        <div className="theme-icon">
                            <span className="light-icon">☀️</span>
                            <span className="dark-icon">🌙</span>
                        </div>
                    </div>
                </div>

                <div className="theme-toggle desktop-theme-toggle" onClick={toggleTheme}>
                    <div className="theme-icon">
                        <span className="light-icon">☀️</span>
                        <span className="dark-icon">🌙</span>
                    </div>
                </div>

                <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} id="hamburger" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );

    toggleMenu = () => {
    console.log('🎯 Hamburger CLICKED!');
    console.log('Before:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
    console.log('After:', !isMenuOpen);
    document.body.classList.toggle('menu-open');
    console.log('Body class toggled');
};
};

export default Navbar;