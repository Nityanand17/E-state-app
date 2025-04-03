import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Login/login.css';
import { FaEnvelope, FaUser, FaPhone } from 'react-icons/fa';

const BookingForm = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate(); // ✅ Fix: Added for navigation
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post('http://localhost:5000/api/book', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        propertyId: propertyId,
      });

      setConfirmed(true);
    } catch (err) {
      console.error('Booking failed:', err);
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) {
    return (
      <div className="wrapper">
        <div className="success-message">
          <h2>✅ Property booking confirmed!</h2>
          <button onClick={() => navigate('/dashboard')}>Go Back to Dashboard</button>
          <button onClick={() => navigate('/feedback')} style={{ marginTop: '10px' }}>
            Give Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Confirm Booking</h1>
        <div className="input-box">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            name="phone"
            type="text"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />
          <FaPhone className="icon" />
        </div>
        <div className="input-box">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <FaEnvelope className="icon" />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Confirming...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
