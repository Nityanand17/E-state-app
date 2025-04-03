import React, { useEffect, useState } from 'react';
import './Login/login.css'; // ✅ Reuse login page styling
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const [feedback, setFeedback] = useState({
    feedback_message: '',
    rating: 5,
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!feedback.feedback_message) {
      setError('⚠️ Feedback message is required!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.message || '⚠️ Failed to submit feedback');
      }
    } catch (err) {
      setError('⚠️ Server error. Try again later.');
    }
  };

  return (
    <div className="wrapper">
      {submitted ? (
        <div className="success-message">
          <h2>✅ Thank you for your feedback!</h2>
          <button onClick={() => navigate('/dashboard')} style={{ marginTop: '10px' }}>
            Go to Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h1>Your Feedback</h1>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className="input-box" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <textarea
              name="feedback_message"
              rows="5"
              placeholder="Tell us about your experience..."
              onChange={handleChange}
              required
              style={{
                padding: '10px',
                fontSize: '1rem',
                resize: 'none',
                width: '100%',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
          </div>

          <div className="input-box">
            <label>Rating (1-5):</label>
            <input type="number" name="rating" min="1" max="5" value={feedback.rating} onChange={handleChange} required />
          </div>

          <button type="submit">Submit Feedback</button>
        </form>
      )}
    </div>
  );
};

export default Feedback;
