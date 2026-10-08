import { useEffect } from "react";
import { Link, useLocation } from "react-router";

import "./Landing.css";

const Landing = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    document
      .getElementById(hash.slice(1))
      ?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  return (
    <main className="landing">
      {/* Hero */}
      <section className="landing-hero section">
        <div className="container">
          <div className="landing-hero-card">
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

            <div className="hero-visual">
              <img
                src="/hero.png"
                alt="Man wearing a traditional Thawb"
                className="hero-thawb-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features section">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <path d="M6 3h12v18H6z" />
                  <path d="M9 7h6" />
                  <path d="M9 11h6" />
                  <path d="M9 15h4" />
                </svg>
              </div>

              <div>
                <h2>Wide Range of Materials</h2>

                <p>
                  Choose from a variety of materials to create the perfect
                  thawb for you.
                </p>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                  <path d="M9 10a3 3 0 1 1 6 0" />
                  <path d="M8 17c1.2-1.5 2.4-2.2 4-2.2s2.8.7 4 2.2" />
                </svg>
              </div>

              <div>
                <h2>Trusted Tailors</h2>

                <p>
                  Connect with professional tailors and get your thawb made to
                  your measurements.
                </p>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </div>

              <div>
                <h2>Simple and Fast Process</h2>

                <p>
                  Order your thawb easily and follow its progress from start
                  to finish.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works section">
        <div className="container">
          <div className="section-heading">
            <p className="section-label">HOW IT WORKS</p>

            <h2>From selection to delivery.</h2>
          </div>

          <div className="steps">
            <div className="step">
              <span className="step-number">01</span>

              <h3>Choose</h3>

              <p>Select your preferred material and tailor.</p>
            </div>

            <div className="step">
              <span className="step-number">02</span>

              <h3>Customize</h3>

              <p>Add your measurements and thawb preferences.</p>
            </div>

            <div className="step">
              <span className="step-number">03</span>

              <h3>Order</h3>

              <p>Place your order and let the tailor handle the rest.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;