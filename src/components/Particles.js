import React, { useEffect } from 'react';

const Particles = () => {
    useEffect(() => {
        createParticles();
    }, []);

    const createParticles = () => {
        const particles = document.getElementById('particles');
        if (!particles) return;
        
        // Clear existing particles
        particles.innerHTML = '';
        
        const colors = ['var(--accent)', 'var(--success)', 'var(--warning)'];
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 20 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
            
            particles.appendChild(particle);
        }
    };

    return <div className="particles" id="particles"></div>;
};

export default Particles;