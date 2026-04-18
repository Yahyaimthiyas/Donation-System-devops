import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandsHelping, FaEye, FaUsers, FaRocket } from 'react-icons/fa';

const About = () => {
  return (
    <div className="about-wrapper">
      <div className="about-container">
        {/* Header Section */}
        <section className="about-hero-section">
          <h1 className="about-title">
            <FaHandsHelping className="title-icon" /> About the Donation Platform
          </h1>
          <p className="about-subtitle">
            Connecting donors and beneficiaries to create a lasting impact.
          </p>
        </section>

        {/* Mission Section */}
        <section className="about-card">
          <h2 className="section-title">Our Mission</h2>
          <p className="section-text">
            The Donation Platform is dedicated to transforming lives through the power of giving. We connect donors and beneficiaries to create meaningful impact, ensuring every donation is transparent and efficient.
          </p>
          <p className="section-text">
            Our mission is to empower a global community of changemakers by providing a trusted platform for charitable giving. We prioritize transparency and ease, so donors can support causes confidently, and beneficiaries can drive real change.
          </p>
        </section>

        {/* Values Section */}
        <section className="about-card">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <FaEye className="value-icon transparency" />
              <h3>Transparency</h3>
              <p>See the impact of every donation with clear tracking.</p>
            </div>
            <div className="value-item">
              <FaUsers className="value-icon community" />
              <h3>Community</h3>
              <p>Join a network of givers and doers making a difference.</p>
            </div>
            <div className="value-item">
              <FaRocket className="value-icon simplicity" />
              <h3>Simplicity</h3>
              <p>Donate or create drives effortlessly in just a few clicks.</p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="about-cta-section">
          <h2 className="section-title">Get Involved</h2>
          <p className="section-text">
            Be a part of our mission to make a difference—start today!
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-btn primary">Join Now</Link>
            <Link to="/drives" className="cta-btn secondary">Explore Drives</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;