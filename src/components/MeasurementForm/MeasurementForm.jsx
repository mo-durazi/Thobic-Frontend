import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";

import { UserContext } from "../../contexts/UserContext";
import { MEASUREMENT_FIELDS } from "../../lib/measurementFields";
import {
  createMeasurements,
  getMyMeasurements,
  updateMeasurements,
} from "../../services/measurementService";

import "./MeasurementForm.css";

const initialState = Object.fromEntries(
  MEASUREMENT_FIELDS.map((field) => [field.name, ""])
);

const MeasurementForm = ({ isEdit = false }) => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const navigate = useNavigate();

  const isClient = user?.role === "client";

  useEffect(() => {
    if (!isEdit || !isClient) return;

    const loadMeasurements = async () => {
      try {
        const data = await getMyMeasurements();

        if (!data) {
          navigate("/measurements");
          return;
        }

        setFormData(
          Object.fromEntries(
            MEASUREMENT_FIELDS.map(({ name }) => [
              name,
              String(data[name] ?? ""),
            ])
          )
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMeasurements();
  }, [isEdit, isClient, navigate]);

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  if (!isClient) {
    return (
      <main className="measurement-form-page">
        <p>Only clients can manage measurements.</p>
      </main>
    );
  }

  const handleChange = (evt) => {
    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setError("");

    const values = Object.fromEntries(
      Object.entries(formData).map(([name, value]) => [
        name,
        parseFloat(value),
      ])
    );

    try {
      if (isEdit) {
        await updateMeasurements(values);
      } else {
        await createMeasurements(values);
      }

      navigate("/measurements");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <main className="measurement-form-page">
        <p>Loading measurements...</p>
      </main>
    );
  }

  return (
    <main className="measurement-form-page">
      <div className="measurement-form-card">
        <div className="measurement-form-header">
          <h1>
            {isEdit ? "Edit My Measurements" : "Add Measurements"}
          </h1>

          <p>
            Enter your measurements in centimeters to help the tailor prepare
            your Thawb accurately.
          </p>
        </div>

        {error && (
          <p className="measurement-form-error" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="measurement-form-grid">
            {MEASUREMENT_FIELDS.map(({ name, label }) => (
              <div className="measurement-form-field" key={name}>
                <label htmlFor={name}>{label}</label>

                <div className="measurement-input-wrapper">
                  <input
                    type="number"
                    id={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    required
                  />

                  <span>cm</span>
                </div>
              </div>
            ))}
          </div>

          <div className="measurement-form-actions">
            <Link to="/measurements" className="secondary-button">
              Cancel
            </Link>

            <button type="submit" className="primary-button">
              {isEdit ? "Save Changes" : "Save Measurements"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default MeasurementForm;