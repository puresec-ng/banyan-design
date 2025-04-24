import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <section id="home" className="hero">
                <div className="hero-content">
                    <h1>Your Trusted Partner for Efficient Claims Management & Financial Advisory</h1>
                    <p>Experience seamless claims processing with Nigeria's leading technology-driven claims consultancy</p>
                    <div className="hero-buttons">
                        <Link to="/submit-claim" className="btn btn-primary">Submit a Claim</Link>
                        <Link to="/#contact" className="btn btn-secondary">Schedule a Consultation</Link>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about">
                <div className="container">
                    <h2>About Us</h2>
                    <div className="about-content">
                        <div className="about-text">
                            <p>Banyan Claims Consultant Limited is Nigeria's most trusted technology-driven claims consultancy. We specialize in providing efficient, transparent, and professional claims management services to individuals and businesses across Nigeria.</p>
                            <p>Our team of experienced professionals combines deep industry knowledge with cutting-edge technology to ensure your claims are handled with the utmost care and efficiency.</p>
                        </div>
                        <div className="about-features">
                            <div className="feature">
                                <i className="fas fa-check-circle"></i>
                                <h4>Expert Team</h4>
                                <p>Experienced professionals dedicated to your success</p>
                            </div>
                            <div className="feature">
                                <i className="fas fa-bolt"></i>
                                <h4>Fast Processing</h4>
                                <p>Quick and efficient claims handling</p>
                            </div>
                            <div className="feature">
                                <i className="fas fa-shield-alt"></i>
                                <h4>Trusted Service</h4>
                                <p>Reliable and transparent claims management</p>
                            </div>
                            <div className="feature">
                                <i className="fas fa-chart-line"></i>
                                <h4>Data-Driven</h4>
                                <p>Advanced analytics for optimal claim outcomes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="services">
                <div className="container">
                    <h2>Our Services</h2>
                    <div className="services-grid">
                        <div className="service-card">
                            <i className="fas fa-user"></i>
                            <h3>For Individuals</h3>
                            <p>Claims Management and Financial Risk Advisory for Personal Insurance</p>
                            <div className="service-ctas">
                                <Link to="/submit-claim" className="btn btn-primary">Submit a Claim</Link>
                                <Link to="/speak-to-advisor" className="btn btn-secondary">Speak to an Advisor</Link>
                            </div>
                        </div>
                        <div className="service-card">
                            <i className="fas fa-building"></i>
                            <h3>For Businesses/SMEs</h3>
                            <p>Tailored Claims and Risk Advisory Services for Companies</p>
                            <div className="service-ctas">
                                <Link to="/request-consultation" className="btn btn-primary">Request a Consultation</Link>
                                <Link to="/learn-more" className="btn btn-secondary">Learn More</Link>
                            </div>
                        </div>
                        <div className="service-card">
                            <i className="fas fa-gavel"></i>
                            <h3>For Legal Professionals</h3>
                            <p>Specialized Services for Legal Advisors and Law Firms Handling Claims</p>
                            <div className="service-ctas">
                                <Link to="/partner" className="btn btn-primary">Partner with Us</Link>
                                <Link to="/get-started" className="btn btn-secondary">Get Started</Link>
                            </div>
                        </div>
                        <div className="service-card">
                            <i className="fas fa-briefcase"></i>
                            <h3>For Corporate Clients</h3>
                            <p>Corporate Claims Management and Risk Mitigation Services</p>
                            <div className="service-ctas">
                                <Link to="/corporate-advisory" className="btn btn-primary">Get Corporate Advisory</Link>
                                <Link to="/request-proposal" className="btn btn-secondary">Request Proposal</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Claims Process Section */}
            <section id="process" className="how-it-works">
                <div className="container">
                    <h2>How It Works</h2>
                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Submit Your Claim</h3>
                            <p>Fill out our simple online form and upload relevant documents</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>We Process</h3>
                            <p>Our experts review and process your claim efficiently</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Get Results</h3>
                            <p>Receive your settlement quickly and hassle-free</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact">
                <div className="container">
                    <h2>Contact Us</h2>
                    <div className="contact-grid">
                        <div className="contact-info">
                            <h3>Get in Touch</h3>
                            <p>Have questions? We're here to help you with your claims management needs.</p>
                            <ul>
                                <li><i className="fas fa-phone"></i> +234 XXX XXX XXXX</li>
                                <li><i className="fas fa-envelope"></i> info@banyanclaims.com</li>
                                <li><i className="fas fa-map-marker-alt"></i> Lagos, Nigeria</li>
                            </ul>
                            <div className="office-hours">
                                <h4>Office Hours</h4>
                                <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                                <p>Saturday: 10:00 AM - 2:00 PM</p>
                            </div>
                        </div>
                        <div className="contact-form">
                            <form id="contactForm">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input type="text" id="name" name="name" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input type="tel" id="phone" name="phone" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" name="message" rows="5" required></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials">
                <div className="container">
                    <h2>What Our Clients Say</h2>
                    <div className="testimonials-slider">
                        <div className="testimonial">
                            <div className="testimonial-content">
                                <p>"Banyan Claims made my insurance claim process incredibly smooth. Their professional team guided me every step of the way."</p>
                                <div className="client-info">
                                    <img src="https://ui-avatars.com/api/?name=John+Doe&background=004D40&color=fff&size=200" alt="Client" />
                                    <div>
                                        <h4>John Doe</h4>
                                        <p>Business Owner</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Chatbot */}
            <div id="chatbot" className="chatbot">
                <button className="chatbot-toggle">
                    <i className="fas fa-comments"></i>
                    <span>Need Help?</span>
                </button>
            </div>
        </div>
    );
};

export default Home; 