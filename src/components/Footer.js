import React from 'react';
import '../styles/components/footer.css';

const Footer = () => {
    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const downloadResume = () => {
        const link = document.createElement('a');
        link.href = '/assets/files/Sneha_Khatoon_Resume.pdf';
        link.download = 'Sneha_Khatoon_Resume.pdf';
        link.click();
    };

    return (
        <footer className="footer" id="contact">
            <div className="footer-content">
                <div className="footer-grid">
                    <div className="footer-section">
                        <h4>Let's Work Together</h4>
                        <p>
                            I'm always open to discussing new opportunities, interesting projects, 
                            or just having a chat about technology. Feel free to reach out!
                        </p>
                        <p><strong>Email: </strong>
                            <a href="mailto:snehakhatoon19@gmail.com">
                                snehakhatoon19@gmail.com
                            </a>
                        </p>
                        <p><strong>Location:</strong> Surampalem, India</p>
                        <div className="social-links">
                            <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">GitHub</a>
                            <a href="https://www.linkedin.com/in/sneha-khatoon-0b3882295/" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                            <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">Twitter</a>
                            <a href="https://www.instagram.com/_sn_e____ha/" className="social-link" target="_blank" rel="noopener noreferrer">Instagram</a>
                        </div>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><a href="#home" onClick={(e) => scrollToSection(e, 'home')}>Home</a></li>
                            <li><a href="#about" onClick={(e) => scrollToSection(e, 'about')}>About</a></li>
                            <li><a href="#skills" onClick={(e) => scrollToSection(e, 'skills')}>Skills</a></li>
                            <li><a href="#projects" onClick={(e) => scrollToSection(e, 'projects')}>Projects</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Services</h4>
                        <ul className="footer-links">
                            <li><a href="#projects" onClick={(e) => scrollToSection(e, 'projects')}>Web Development</a></li>
                            <li><a href="#projects" onClick={(e) => scrollToSection(e, 'projects')}>Frontend Development</a></li>
                            <li><a href="#projects" onClick={(e) => scrollToSection(e, 'projects')}>Backend Development</a></li>
                            <li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Consulting</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Resources</h4>
                        <ul className="footer-links">
                            <li><a href="#">Blog</a></li>
                            <li><a href="#" onClick={downloadResume}>Resume</a></li>
                            <li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Contact</a></li>
                        </ul>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p>&copy; 2025 Sneha Khatoon. All rights reserved. Built with passion and clean code.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;