import React from 'react';
import '../styles/components/about.css';

const About = () => {
    return (
        <section id="about" className="section">
            <div className="decoration decoration-1"></div>
            <div className="decoration decoration-2"></div>
            <div className="container">
                <h2 className="section-title">About Me</h2>
                <p className="section-subtitle">Get to know me better</p>
                
                <div className="about-grid">
                    <div className="about-image">
                        <img 
                            src="/assets/images/profile-photo1.jpg" 
                            alt="Profile Photo" 
                            className="profile-photo" 
                        />
                    </div>
                    <div className="about-content">
                        <h3>Hello, I'm a passionate developer</h3>
                        <p>
                            I specialize in building modern web applications with clean, efficient code. 
                            My journey started with a curiosity about how websites work, and it has evolved 
                            into a passion for creating digital solutions that make a real impact.
                        </p>
                        <p>
                            I believe in continuous learning and staying updated with the latest technologies. 
                            When I'm not coding, I enjoy contributing to open-source projects, reading tech blogs, 
                            and sharing knowledge with the developer community.
                        </p>
                        <p>
                            My goal is to build software that not only works perfectly but also provides 
                            exceptional user experiences and maintainable codebases for future development.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;