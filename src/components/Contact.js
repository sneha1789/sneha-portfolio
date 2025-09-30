import React, { useState } from 'react';
import '../styles/components/contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('access_key', '71cd6638-2f14-44c0-8520-06ba4afa6530');
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('message', formData.message);
            formDataToSend.append('botcheck', '');

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();

            if (data.success) {
                setShowSuccess(true);
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setShowSuccess(false), 5000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            alert('Sorry, there was an error sending your message. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="contact-section">
            <div className="container">
                <h2 className="section-title">Get In Touch</h2>
                <p className="section-subtitle">Let's work together on your next project</p>
                
                <div className="contact-container">
                    <div className="contact-grid">
                        <div className="contact-info">
                            <div className="contact-card">
                                <div className="contact-icon">📧</div>
                                <h4>Email</h4>
                                <p>
                                    <a href="mailto:snehakhatoon19@gmail.com">
                                        snehakhatoon19@gmail.com
                                    </a>
                                </p>
                            </div>
                            
                            <div className="contact-card">
                                <div className="contact-icon">📍</div>
                                <h4>Location</h4>
                                <p>Surampalem, India</p>
                            </div>
                            
                            <div className="contact-card">
                                <div className="contact-icon">💼</div>
                                <h4>Availability</h4>
                                <p>Currently available for freelance projects</p>
                            </div>
                        </div>
                        
                        <div className="contact-form">
                            <div className={`success-message ${showSuccess ? 'show' : ''}`} id="successMessage">
                                ✅ Thank you! Your message has been sent successfully.
                            </div>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="floating-label">
                                    <input 
                                        type="text" 
                                        id="name" 
                                        className="form-control" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        required 
                                    />
                                    <label htmlFor="name">Your Name</label>
                                </div>
                                
                                <div className="floating-label">
                                    <input 
                                        type="email" 
                                        id="email" 
                                        className="form-control" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        required 
                                    />
                                    <label htmlFor="email">Email Address</label>
                                </div>
                                
                                <div className="floating-label">
                                    <textarea 
                                        id="message" 
                                        name="message" 
                                        className="form-control" 
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        required
                                    ></textarea>
                                    <label htmlFor="message">Your Message</label>
                                </div>
                                
                                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />
                                
                                <button 
                                    type="submit" 
                                    className="submit-btn" 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="loading"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <span className="btn-text">Send Message</span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;