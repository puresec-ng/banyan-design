import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-section">
                        <img src="/assets/images/logo-white.png" alt="Banyan Claims Consultant Limited" className="footer-logo" />
                        <div className="tagline">
                            <div className="tagline-text">Simplifying Claims, Strengthening Trust</div>
                        </div>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/#about">About Us</Link></li>
                            <li><Link to="/#services">Services</Link></li>
                            <li><Link to="/#process">Claims Process</Link></li>
                            <li><Link to="/#contact">Contact</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Services</h4>
                        <ul>
                            <li><Link to="/services/sme">SME Claims</Link></li>
                            <li><Link to="/services/agro">Agro Claims</Link></li>
                            <li><Link to="/services/motor">Motor Claims</Link></li>
                            <li><Link to="/services/gadget">Gadget Claims</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Contact Us</h4>
                        <ul className="contact-info">
                            <li><i className="fas fa-phone"></i> +234 XXX XXX XXXX</li>
                            <li><i className="fas fa-envelope"></i> info@banyanclaims.com</li>
                            <li><i className="fas fa-map-marker-alt"></i> Lagos, Nigeria</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 