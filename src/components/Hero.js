import React from 'react';
import '../styles/components/hero.css';

const Hero = () => {
    const downloadResume = () => {
        // Resume download logic
        const link = document.createElement('a');
        link.href = '/assets/files/Sneha_Khatoon_Resume.pdf';
        link.download = 'Sneha_Khatoon_Resume.pdf';
        link.click();
    };

    const scrollToProjects = (e) => {
        e.preventDefault();
        const element = document.getElementById('projects');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const roadmapItems = [
        {
            status: 'completed',
            title: 'Started Coding Journey',
            description: 'Learned HTML, CSS, and JavaScript fundamentals',
            date: 'Completed - 2022'
        },
        {
            status: 'completed',
            title: 'Frontend Mastery',
            description: 'Mastered React, TypeScript, and modern CSS',
            date: 'Completed - 2023'
        },
        {
            status: 'current',
            title: 'Backend Development',
            description: 'Learning Node.js, Express, and database design',
            date: 'In Progress - 2024'
        },
        {
            status: 'future',
            title: 'Cloud & DevOps',
            description: 'AWS, Docker, CI/CD, and system architecture',
            date: 'Planned - 2024'
        },
        {
            status: 'future',
            title: 'Senior Developer Role',
            description: 'Leading projects and mentoring junior developers',
            date: 'Goal - 2025'
        },
        {
            status: 'future',
            title: 'Tech Leadership',
            description: 'Technical leadership and product architecture',
            date: 'Vision - 2026'
        }
    ];

    return (
        <section id="home" className="hero">
            <div className="particles" id="particles"></div>
            
            <div className="geometric-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
                <div className="shape shape-5"></div>
                <div className="shape shape-6"></div>
            </div>
            
            <div className="hero-container">
                <div className="hero-content">
                    <h1>FULL<span className="outline-text"> STACK</span> DEVELOPER</h1>
                    <p className="subtitle">Building digital experiences with clean code</p>
                    <p className="description">
                        I'm a passionate developer focused on creating efficient, scalable solutions. 
                        Currently working on mastering modern web technologies and contributing to open source.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn-primary" onClick={downloadResume}>
                            <span>📄</span>
                            Download Resume
                        </button>
                        <button className="btn-secondary" onClick={scrollToProjects}>
                            View Projects
                        </button>
                    </div>
                </div>

                <div className="roadmap">
                    <h3 className="roadmap-title">My <span className="outline-text-development">Development</span> Journey</h3>
                    <div className="roadmap-container">
                        <div className="roadmap-line"></div>
                        
                        {roadmapItems.map((item, index) => (
                            <div key={index} className={`roadmap-item ${item.status}`}>
                                <h4 className="roadmap-item-title">{item.title}</h4>
                                <p className="roadmap-item-desc">{item.description}</p>
                                <div className="roadmap-item-date">{item.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;