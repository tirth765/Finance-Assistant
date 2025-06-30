import React from 'react';
import '../../css/AboutUs/AboutUs.css';

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <div className="aboutus-content">
        <div className="aboutus-header">
          <h1>About Finance Assistant</h1>
          <p className="aboutus-subtitle">Your Personal Financial Management Solution</p>
        </div>

        <div className="aboutus-sections">
          <section className="aboutus-section">
            <h2>Our Mission</h2>
            <p>
              At Finance Assistant, we're dedicated to helping individuals take control of their financial future. 
              Our mission is to provide intuitive tools and insights that make personal finance management 
              accessible, efficient, and effective for everyone.
            </p>
          </section>

          <section className="aboutus-section">
            <h2>What We Offer</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Expense Tracking</h3>
                <p>Monitor your daily, monthly, and yearly expenses with detailed categorization and analysis.</p>
              </div>
              <div className="feature-card">
                <h3>Budget Management</h3>
                <p>Create and manage budgets to help you stay on track with your financial goals.</p>
              </div>
              <div className="feature-card">
                <h3>Financial Insights</h3>
                <p>Get valuable insights into your spending patterns and financial health.</p>
              </div>
              <div className="feature-card">
                <h3>Secure Platform</h3>
                <p>Your financial data is protected with industry-standard security measures.</p>
              </div>
            </div>
          </section>

          <section className="aboutus-section">
            <h2>Our Team</h2>
            <p>
              We're a team of financial experts, developers, and designers passionate about creating 
              tools that make a difference in people's financial lives. Our diverse backgrounds and 
              expertise allow us to approach financial management from multiple perspectives.
            </p>
          </section>

          <section className="aboutus-section">
            <h2>Why Choose Us</h2>
            <ul className="benefits-list">
              <li>User-friendly interface designed for all experience levels</li>
              <li>Comprehensive financial tracking and analysis tools</li>
              <li>Regular updates and new features based on user feedback</li>
              <li>Dedicated customer support team</li>
              <li>Secure and reliable platform</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 