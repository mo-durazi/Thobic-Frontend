import { useEffect } from 'react';
import './Landing.css';
import { Link, useLocation } from 'react-router';

const Landing = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  return (
    <main className="landing">

      {/* Hero Section */}
      <section className="landing-hero section">
        <div className="container landing-hero-content">

          <div className="hero-content">
            <p className="hero-label">THOBIC</p>

            <h1>
              Custom Thawb,
              <br />
              Made Easy.
            </h1>

            <p className="hero-description">
              Choose your material, add your measurements, place your order,
              and let professional tailors handle the rest.
            </p>

            <div className="hero-actions">
              <Link to="/shops" className="primary-button">
                Get Started
              </Link>

              <Link to="/shops" className="secondary-button">
                Browse Tailors
              </Link>
            </div>
          </div>

          <div className="hero-art" aria-label="Thobic tailoring">
            <div className="hero-art-mark">T</div>
            <p>Made for your measurements</p>
            <span>Crafted with care in Bahrain</span>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features section">
        <div className="container features-grid">

          <div className="feature">
            <h2>Wide Range of Materials</h2>

            <p>
              Choose from a variety of materials to create the perfect
              thawb for you.
            </p>
          </div>

          <div className="feature">
            <h2>Trusted Tailors</h2>

            <p>
              Connect with professional tailors and get your thawb made
              to your measurements.
            </p>
          </div>

          <div className="feature">
            <h2>Simple and Fast Process</h2>

            <p>
              Order your thawb easily and follow its progress from start
              to finish.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works section">
        <div className="container">

          <div className="section-heading">
            <p className="section-label">HOW IT WORKS</p>

            <h2>
              From selection to delivery.
            </h2>
          </div>

          <div className="steps">

            <div className="step">
              <span className="step-number">01</span>

              <h3>Choose</h3>

              <p>
                Select your preferred material and tailor.
              </p>
            </div>

            <div className="step">
              <span className="step-number">02</span>

              <h3>Customize</h3>

              <p>
                Add your measurements and thawb preferences.
              </p>
            </div>

            <div className="step">
              <span className="step-number">03</span>

              <h3>Order</h3>

              <p>
                Place your order and let the tailor handle the rest.
              </p>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
};

export default Landing;
