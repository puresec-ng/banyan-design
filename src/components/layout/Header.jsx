import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <nav className="nav-container">
                <div className="logo">
                    <Link to="/">
                        <img src="/assets/images/logo.jpg" alt="Banyan Claims Consultant Limited" />
                    </Link>
                </div>
                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="active">Home</Link>
                    <Link to="/#about">About</Link>
                    <Link to="/#services">Services</Link>
                    <Link to="/#process">Claims Process</Link>
                    <Link to="/#contact">Contact</Link>
                    <Link to="/portal">Client Portal</Link>
                    <Link to="/submit-claim">Submit a Claim</Link>
                </div>
                <button 
                    className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        </header>
    );
};

export default Header; 