import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router";

import { UserContext } from "../../contexts/UserContext";
import { MEASUREMENT_FIELDS } from "../../lib/measurementFields";
import {
  deleteMeasurements,
  getMyMeasurements,
} from "../../services/measurementService";

import "./MyMeasurements.css";

const MyMeasurements = () => {
  const { user } = useContext(UserContext);
  const [measurements, setMeasurements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const isClient = user?.role === "client";

  useEffect(() => {
    if (!isClient) return;

    const loadMeasurements = async () => {
      try {
        const data = await getMyMeasurements();
        setMeasurements(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMeasurements();
  }, [isClient]);

  const handleDelete = async () => {
    setDeleteError("");

    try {
      await deleteMeasurements();
      setMeasurements(null);
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  if (!isClient) {
    return (
      <main className="measurements-page">
        <div className="measurements-empty">
          <p>Only clients can manage measurements.</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="measurements-page">
        <p className="measurements-status">Loading measurements...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="measurements-page">
        <div className="measurements-empty">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="measurements-page">
      <h1>My Measurements</h1>

      {deleteError && (
        <p className="measurements-message" role="alert">
          {deleteError}
        </p>
      )}

      {measurements ? (
        <section className="measurements-card">
          <div className="measurements-grid">
            {MEASUREMENT_FIELDS.map(({ name, label }) => (
              <div className="measurement-item" key={name}>
                <span className="measurement-item-label">{label}</span>
                <span className="measurement-item-value">
                  {measurements[name]} cm
                </span>
              </div>
            ))}
          </div>

          <div className="measurements-actions">
            <Link to="/measurements/edit">
              Edit My Measurements
            </Link>

            <button type="button" onClick={handleDelete}>
              Delete My Measurements
            </button>
          </div>
        </section>
      ) : (
        <section className="measurements-empty">
          <p>You haven't added your measurements yet.</p>

          <Link className="primary-button" to="/measurements/new">
            Add Measurements
          </Link>
        </section>
      )}
    </main>
  );
};

export default MyMeasurements;